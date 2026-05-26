require('dotenv').config();

const express = require('express');
const axios = require('axios');

const app = express();

app.use(express.json({
  limit: '1mb'
}));

const PORT = process.env.PORT || 3000;

const SERVICE_NAME = process.env.SERVICE_NAME || 'Monday Discord Relay';
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
const DISCORD_USERNAME = process.env.DISCORD_USERNAME || '';
const DISCORD_ROLE_ID = process.env.DISCORD_ROLE_ID || '';

const MONDAY_API_TOKEN = process.env.MONDAY_API_TOKEN;

const TARGET_GROUP_NAME = process.env.TARGET_GROUP_NAME;
const TEST_ROUTE_ENABLED = process.env.TEST_ROUTE_ENABLED === 'true';

const EMBED_TITLE = process.env.EMBED_TITLE || 'Deployment Readiness Confirmed';
const EMBED_FOOTER = process.env.EMBED_FOOTER || SERVICE_NAME;
const EMBED_STATUS = process.env.EMBED_STATUS || TARGET_GROUP_NAME || 'Ready';
const EMBED_COLOR = parseInt(process.env.EMBED_COLOR || '4994733', 10);

const SHOW_DEBUG_FIELDS = process.env.SHOW_DEBUG_FIELDS === 'true';
const USE_BOARD_NAME_AS_WEBHOOK_USERNAME = process.env.USE_BOARD_NAME_AS_WEBHOOK_USERNAME !== 'false';

const recentTriggers = new Map();

if (!DISCORD_WEBHOOK_URL) {
  console.warn('[WARN] DISCORD_WEBHOOK_URL is not set.');
}

if (!MONDAY_API_TOKEN) {
  console.warn('[WARN] MONDAY_API_TOKEN is not set. Monday item details may show as Unknown.');
}

if (!TARGET_GROUP_NAME) {
  console.warn('[WARN] TARGET_GROUP_NAME is not set. No Monday group will be treated as the target group.');
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

function toDiscordTimestamp(dateValue) {
  const timestamp = Date.parse(dateValue);

  if (!Number.isFinite(timestamp)) {
    return null;
  }

  return `<t:${Math.floor(timestamp / 1000)}:F>`;
}

function safeFieldValue(value, fallback = 'N/A') {
  const text = String(value || '').trim();

  if (!text) {
    return fallback;
  }

  return text.length > 1024 ? `${text.slice(0, 1021)}...` : text;
}

function safeWebhookUsername(value) {
  const text = String(value || '').trim();

  if (!text) {
    return SERVICE_NAME;
  }

  return text.slice(0, 80);
}

async function mondayGraphQL(query, variables = {}) {
  if (!MONDAY_API_TOKEN) {
    throw new Error('MONDAY_API_TOKEN is not configured.');
  }

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

  if (response.data?.errors?.length) {
    throw new Error(JSON.stringify(response.data.errors));
  }

  return response.data;
}

async function getMondayItemDetails(pulseId, boardId, sourceGroupId, destGroupId) {
  if (!MONDAY_API_TOKEN || !pulseId) {
    return {
      itemName: 'Unknown Item',
      boardName: 'Unknown Board',
      itemUrl: null,
      sourceGroupName: sourceGroupId || 'Unknown Source Group',
      destinationGroupName: 'Unknown Destination Group',
      accountSlug: null
    };
  }

  try {
    const query = `
      query ($itemIds: [ID!], $boardIds: [ID!]) {
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
        boards(ids: $boardIds) {
          id
          name
          groups {
            id
            title
          }
        }
      }
    `;

    const variables = {
      itemIds: [String(pulseId)],
      boardIds: boardId ? [String(boardId)] : []
    };

    const response = await mondayGraphQL(query, variables);

    const item = response.data?.items?.[0];
    const board = response.data?.boards?.[0];
    const accountSlug = response.data?.account?.slug || null;

    const sourceGroup = board?.groups?.find((group) => group.id === sourceGroupId);
    const destinationGroup = board?.groups?.find((group) => group.id === destGroupId);

    if (!item) {
      console.warn(`[MONDAY API] No item found for pulseId ${pulseId}.`);
    }

    return {
      itemName: item?.name || 'Unknown Item',
      boardName: item?.board?.name || board?.name || 'Unknown Board',
      itemUrl: accountSlug && (item?.board?.id || boardId) && (item?.id || pulseId)
        ? `https://${accountSlug}.monday.com/boards/${item?.board?.id || boardId}/pulses/${item?.id || pulseId}`
        : null,
      sourceGroupName: sourceGroup?.title || sourceGroupId || 'Unknown Source Group',
      destinationGroupName: destinationGroup?.title || destGroupId || 'Unknown Destination Group',
      accountSlug
    };
  } catch (error) {
    console.error(
      '[MONDAY API ERROR]',
      error.response?.data || error.message || error
    );

    return {
      itemName: 'Unknown Item',
      boardName: 'Unknown Board',
      itemUrl: null,
      sourceGroupName: sourceGroupId || 'Unknown Source Group',
      destinationGroupName: destGroupId || 'Unknown Destination Group',
      accountSlug: null
    };
  }
}

app.get('/', (req, res) => {
  res.status(200).send(`${SERVICE_NAME} is running.`);
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: SERVICE_NAME,
    targetGroup: TARGET_GROUP_NAME || null,
    testRouteEnabled: TEST_ROUTE_ENABLED,
    debugFieldsEnabled: SHOW_DEBUG_FIELDS,
    boardNameAsWebhookUsername: USE_BOARD_NAME_AS_WEBHOOK_USERNAME
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
      username: safeWebhookUsername(DISCORD_USERNAME || SERVICE_NAME),
      content: `${SERVICE_NAME} test message.`
    });

    return res.status(200).send('Discord test sent successfully.');
  } catch (error) {
    console.error(
      '[TEST DISCORD ERROR]',
      error.response?.data || error.message || error
    );

    return res.status(500).send('Discord test failed. Check service logs.');
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

    const boardId =
      event.boardId ||
      event.board_id ||
      null;

    const sourceGroupId =
      event.sourceGroupId ||
      event.source_group_id ||
      null;

    const destinationGroupId =
      event.destGroupId ||
      event.destinationGroupId ||
      event.dest_group_id ||
      null;

    const webhookDestinationGroupName =
      event.destGroup?.title ||
      event.groupName ||
      event.group?.title ||
      event.value?.label?.text ||
      event.value?.name ||
      event.dest_group?.title ||
      null;

    const mondayDetails = await getMondayItemDetails(
      pulseId,
      boardId,
      sourceGroupId,
      destinationGroupId
    );

    const groupName =
      webhookDestinationGroupName ||
      mondayDetails.destinationGroupName ||
      'Unknown Group';

    if (!TARGET_GROUP_NAME || normalize(groupName) !== normalize(TARGET_GROUP_NAME)) {
      console.log(
        `[SKIPPED] "${groupName}" does not match target group "${TARGET_GROUP_NAME || 'Not Configured'}".`
      );

      return res.sendStatus(200);
    }

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

    const sourceGroupName = mondayDetails.sourceGroupName;
    const destinationGroupName = groupName;
    const itemUrl = mondayDetails.itemUrl;
    const movedAt = toDiscordTimestamp(event.triggerTime);

    console.log(`[INFO] Item "${itemName}" moved from "${sourceGroupName}" to "${destinationGroupName}".`);

    const descriptionStatus = EMBED_STATUS || destinationGroupName;

    const embed = {
      title: EMBED_TITLE,
      description: `**${itemName}** has moved into **${destinationGroupName}**.`,
      color: EMBED_COLOR,
      fields: [
        {
          name: 'Status',
          value: safeFieldValue(descriptionStatus),
          inline: true
        },
        {
          name: 'Board',
          value: safeFieldValue(boardName),
          inline: true
        },
        {
          name: 'Moved To',
          value: safeFieldValue(destinationGroupName),
          inline: true
        },
        {
          name: 'Moved From',
          value: safeFieldValue(sourceGroupName),
          inline: true
        },
        {
          name: 'Triggered By',
          value: event.userId ? `Monday User ${event.userId}` : 'Unknown User',
          inline: true
        },
        {
          name: 'Moved At',
          value: movedAt || 'Unknown Time',
          inline: true
        }
      ],
      footer: {
        text: EMBED_FOOTER
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

    if (SHOW_DEBUG_FIELDS) {
      embed.fields.push(
        {
          name: 'Item ID',
          value: safeFieldValue(pulseId),
          inline: true
        },
        {
          name: 'Board ID',
          value: safeFieldValue(boardId),
          inline: true
        },
        {
          name: 'Trigger ID',
          value: safeFieldValue(event.triggerUuid),
          inline: false
        }
      );
    }

    const webhookUsername = USE_BOARD_NAME_AS_WEBHOOK_USERNAME
      ? safeWebhookUsername(boardName)
      : safeWebhookUsername(DISCORD_USERNAME || SERVICE_NAME);

    const payload = {
      username: webhookUsername,
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

    console.log(`[SENT] Discord webhook sent for "${itemName}" using username "${webhookUsername}".`);

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
  console.log(`${SERVICE_NAME} running on port ${PORT}`);
});