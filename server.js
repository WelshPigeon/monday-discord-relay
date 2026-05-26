require('dotenv').config();

const express = require('express');
const axios = require('axios');

const app = express();

app.use(express.json({
  limit: '1mb'
}));

const PORT = process.env.PORT || 3000;
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
const MONDAY_API_TOKEN = process.env.MONDAY_API_TOKEN;
const TARGET_GROUP_NAME = process.env.TARGET_GROUP_NAME || 'Ready for Deployment';
const DISCORD_USERNAME = process.env.DISCORD_USERNAME || 'Pigeon Studios';

if (!DISCORD_WEBHOOK_URL) {
  console.warn('[WARN] DISCORD_WEBHOOK_URL is not set.');
}

if (!MONDAY_API_TOKEN) {
  console.warn('[WARN] MONDAY_API_TOKEN is not set. Item and board names may show as Unknown.');
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

    const response = await axios.post(
      'https://api.monday.com/v2',
      {
        query,
        variables: {
          itemIds: [String(pulseId)]
        }
      },
      {
        headers: {
          Authorization: MONDAY_API_TOKEN,
          'Content-Type': 'application/json'
        }
      }
    );

    const item = response.data?.data?.items?.[0];

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
      itemUrl: item.board?.id && item.id
        ? `https://pigeonstudios.monday.com/boards/${item.board.id}/pulses/${item.id}`
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
  res.status(200).send('Monday → Discord relay is running.');
});

app.get('/monday', (req, res) => {
  res.status(200).send('Monday webhook endpoint is ready.');
});

// Discord webhook test route
app.get('/test-discord', async (req, res) => {
  try {
    console.log('[TEST] Sending Discord webhook test message...');

    await axios.post(DISCORD_WEBHOOK_URL, {
      username: DISCORD_USERNAME,
      content: 'Monday → Discord relay test message.'
    });

    console.log('[TEST] Discord webhook test successful.');

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

  console.log('[RAW BODY]', JSON.stringify(body, null, 2));

  // Monday.com webhook verification
  if (body.challenge) {
    console.log('[MONDAY] Challenge verification received.');

    return res.status(200).json({
      challenge: body.challenge
    });
  }

  try {
    const event = body.event || {};

    console.log('[MONDAY EVENT]', JSON.stringify(event, null, 2));

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

    if (groupName !== TARGET_GROUP_NAME) {
      console.log(
        `[SKIPPED] "${groupName}" does not match target group "${TARGET_GROUP_NAME}".`
      );

      return res.sendStatus(200);
    }

    console.log('[DISCORD] Sending deployment embed...');

    const embed = {
      title: '✔ Deployment Ready',
      description: `**${itemName}** was moved to **${groupName}**.`,
      color: 7085311,
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
        text: 'Pigeon Studios • Monday Relay'
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

    await axios.post(DISCORD_WEBHOOK_URL, {
      username: DISCORD_USERNAME,
      embeds: [embed]
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
  console.log(`Monday → Discord relay running on port ${PORT}`);
});