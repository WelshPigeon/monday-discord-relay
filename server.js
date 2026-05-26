require('dotenv').config();

const express = require('express');
const axios = require('axios');

const app = express();

app.use(express.json({
  limit: '1mb'
}));

const PORT = process.env.PORT || 3000;

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
const DISCORD_USERNAME = process.env.DISCORD_USERNAME || 'CaliWorld Development';
const DISCORD_ROLE_ID = process.env.DISCORD_ROLE_ID || '';

const MONDAY_API_TOKEN = process.env.MONDAY_API_TOKEN;

const TARGET_GROUP_NAME = process.env.TARGET_GROUP_NAME || 'Ready for Deployment';
const TEST_ROUTE_ENABLED = process.env.TEST_ROUTE_ENABLED === 'true';

const EMBED_COLOR = Number(process.env.EMBED_COLOR || 4994733);

const recentTriggers = new Map();

if (!DISCORD_WEBHOOK_URL) {
  console.warn('[WARN] DISCORD_WEBHOOK_URL is not set.');
}

if (!MONDAY_API_TOKEN) {
  console.warn('[WARN] MONDAY_API_TOKEN is not set. Monday item details may show as Unknown.');
}

function cleanOldTriggers() {
  const now = Date.now();

  for (const [key, timestamp] of recentTriggers.entries()) {
    if (now - timestamp > 10 * 60 * 1000) {
      recentTriggers.delete(key);
    }
  }
}

function isDuplicateTrigger(triggerUuid) {
  if (!triggerUuid) return false;

  cleanOldTriggers();

  if (recentTriggers.has(triggerUuid)) {
    return true;
  }

  recentTriggers.set(triggerUuid, Date.now());
  return false;
}

function normalize(value) {
  return String(value || '').trim().toLowerCase();
}

async function mondayGraphQL(query, variables = {}) {
  const response = await axios.post(
    'https://api.monday.com/v2',
    {
      query,
      variables
    },
    {
      headers: {
        Authorization: MONDAY_API_TOKEN,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    }
  );

  return response.data;
}

async function getMondayItemDetails(pulseId) {
  if (!MONDAY_API_TOKEN || !pulseId) {
    return {
      itemName: 'Unknown Item',
      boardName: 'Unknown Board',
      itemUrl: null
    };
  }

  try {
    const query = `
      query ($itemIds: [ID!]) {
        account {
          slug
        }
        items(ids: $itemIds) {
          id
          name
          board {
            id
            name
          }
        }
      }
    `;

    const response = await mondayGraphQL(query, {
      itemIds: [String(pulseId)]
    });

    const item = response.data?.items?.[0];
    const accountSlug = response.data?.account?.slug;

    if (!item) {
      console.warn(`[MONDAY API] No item found for pulseId ${pulseId}.`);

      return {
        itemName: 'Unknown Item',
        boardName: 'Unknown Board',
        itemUrl: null
      };
    }

    return {
      itemName: item.name || 'Unknown Item',
      boardName: item.board?.name || 'Unknown Board',
      itemUrl: accountSlug && item.board?.id && item.id
        ? `https://${accountSlug}.monday.com/boards/${item.board.id}/pulses/${item.id}`
        : null
    };
  } catch (error) {
    console.error(
      '[MONDAY API ERROR]',
      error.response?.data || error.message || error
    );

    return {
      itemName: 'Unknown Item',
      boardName: 'Unknown Board',
      itemUrl: null
    };
  }
}

app.get('/', (req, res) => {
  res.status(200).send('CaliWorld Monday → Discord relay is running.');
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'monday-discord-relay',
    targetGroup: TARGET_GROUP_NAME
  });
});

app.get('/monday', (req, res) => {
  res.status(200).send('Monday webhook endpoint is ready.');
});

app.get('/test-discord', async (req, res) => {
  if (!TEST_ROUTE_ENABLED) {
    return res.status(403).send('Test route is disabled.');
  }

  try {
    await axios.post(DISCORD_WEBHOOK_URL, {
      username: DISCORD_USERNAME,
      content: '✅ CaliWorld Monday → Discord relay test message.'
    });

    return res.status(200).send('Discord test sent successfully.');
  } catch (error) {
    console.error(
      '[TEST DISCORD ERROR]',
      error.response?.data || error.message || error
    );

    return res.status(500).send('Discord test failed. Check Render logs.');
  }
});

app.post('/monday', async (req, res) => {
  const body = req.body;

  if (body.challenge) {
    console.log('[MONDAY] Challenge verification received.');

    return res.status(200).json({
      challenge: body.challenge
    });
  }

  try {
    const event = body.event || {};

    console.log('[MONDAY EVENT]', JSON.stringify(event, null, 2));

    if (isDuplicateTrigger(event.triggerUuid)) {
      console.log(`[DUPLICATE] Ignored duplicate trigger ${event.triggerUuid}.`);
      return res.sendStatus(200);
    }

    const pulseId =
      event.pulseId ||
      event.itemId ||
      event.item_id ||
      event.pulse_id ||
      null;

    const groupName =
      event.destGroup?.title ||
      event.groupName ||
      event.group?.title ||
      event.value?.label?.text ||
      event.value?.name ||
      event.dest_group?.title ||
      'Unknown Group';

    if (normalize(groupName) !== normalize(TARGET_GROUP_NAME)) {
      console.log(
        `[SKIPPED] "${groupName}" does not match target group "${TARGET_GROUP_NAME}".`
      );

      return res.sendStatus(200);
    }

    const mondayDetails = await getMondayItemDetails(pulseId);

    const itemName =
      event.pulseName ||
      event.itemName ||
      event.name ||
      event.item?.name ||
      event.pulse?.name ||
      mondayDetails.itemName ||
      'Unknown Item';

    const boardName =
      event.boardName ||
      event.board?.name ||
      mondayDetails.boardName ||
      'Unknown Board';

    const itemUrl = mondayDetails.itemUrl;

    console.log(`[INFO] Item "${itemName}" moved to "${groupName}".`);

    const embed = {
      title: '✔ Ready for Deployment',
      description: `**${itemName}** has been moved into **${groupName}**.`,
      color: EMBED_COLOR,
      fields: [
        {
          name: 'Item',
          value: itemName,
          inline: true
        },
        {
          name: 'Board',
          value: boardName,
          inline: true
        },
        {
          name: 'Group',
          value: groupName,
          inline: false
        }
      ],
      footer: {
        text: 'CaliWorld Development • Monday Relay'
      },
      timestamp: new Date().toISOString()
    };

    if (itemUrl) {
      embed.url = itemUrl;
      embed.fields.push({
        name: 'Monday Item',
        value: `[Open Item](${itemUrl})`,
        inline: false
      });
    }

    const payload = {
      username: DISCORD_USERNAME,
      embeds: [embed]
    };

    if (DISCORD_ROLE_ID) {
      payload.content = `<@&${DISCORD_ROLE_ID}>`;
      payload.allowed_mentions = {
        roles: [DISCORD_ROLE_ID]
      };
    }

    await axios.post(DISCORD_WEBHOOK_URL, payload, {
      timeout: 10000
    });

    console.log(`[SENT] Discord webhook sent for "${itemName}".`);

    return res.sendStatus(200);
  } catch (error) {
    console.error(
      '[ERROR]',
      error.response?.data || error.message || error
    );

    return res.sendStatus(500);
  }
});

app.listen(PORT, () => {
  console.log(`CaliWorld Monday → Discord relay running on port ${PORT}`);
});