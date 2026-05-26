require('dotenv').config();

const express = require('express');
const axios = require('axios');

const app = express();

app.use(express.json({
  limit: '1mb'
}));

const PORT = process.env.PORT || 3000;
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
const TARGET_GROUP_NAME = process.env.TARGET_GROUP_NAME || 'Ready For Deployment';
const DISCORD_USERNAME = process.env.DISCORD_USERNAME || 'Pigeon Studios';

if (!DISCORD_WEBHOOK_URL) {
  console.warn('[WARN] DISCORD_WEBHOOK_URL is not set.');
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
      content: '✅ Monday → Discord relay test message.'
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

    const itemName =
      event.pulseName ||
      event.itemName ||
      event.name ||
      event.item?.name ||
      event.pulse?.name ||
      'Unknown Item';

    const boardName =
      event.boardName ||
      event.board?.name ||
      'Unknown Board';

    const groupName =
      event.destGroup?.title ||
      event.groupName ||
      event.group?.title ||
      event.value?.label?.text ||
      event.value?.name ||
      event.dest_group?.title ||
      'Unknown Group';

    console.log(`[INFO] Item "${itemName}" moved to "${groupName}".`);

    // Ignore non-target groups
    if (groupName !== TARGET_GROUP_NAME) {
      console.log(
        `[SKIPPED] "${groupName}" does not match target group "${TARGET_GROUP_NAME}".`
      );

      return res.sendStatus(200);
    }

    console.log('[DISCORD] Sending deployment embed...');

    await axios.post(DISCORD_WEBHOOK_URL, {
      username: DISCORD_USERNAME,
      embeds: [
        {
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
          timestamp: new Date().toISOString()
        }
      ]
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