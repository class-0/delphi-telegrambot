import dotenv from 'dotenv';
import crypto from 'crypto';
import express from 'express';

import { ReadsConfig, readsBot } from './bots/reads.js';
import { mask } from './utils/index.js';
import audit from 'express-requests-logger';
import SmeeClient from 'smee-client';

dotenv.config({ debug: true });

const {
  DELPHI_API_BASE_URL,
  DELPHI_READS_API_KEY,
  DELPHI_READS_BOT_TOKEN,
  DELPHI_READS_WEBHOOK_URL,
  DELPHI_READS_READING_LIST_ID,
  OPENAI_API_KEY,
  DEV,
  PORT,
} = process.env;

if (!DELPHI_READS_READING_LIST_ID) throw new Error('"DELPHI_READS_READING_LIST_ID" env var is required!');
if (!DELPHI_READS_API_KEY) throw new Error('"DELPHI_READS_API_KEY" env var is required!');
if (!DELPHI_API_BASE_URL) throw new Error('"DELPHI_API_BASE_URL" env var is required!');
if (!DELPHI_READS_BOT_TOKEN) throw new Error('"DELPHI_READS_BOT_TOKEN" env var is required!');
if (!DELPHI_READS_WEBHOOK_URL) throw new Error('"DELPHI_READS_WEBHOOK_URL" env var is required!');
if (!OPENAI_API_KEY) throw new Error('"OPENAI_API_KEY" env var is required!');

const readsBotConfiguration: ReadsConfig = {
  botToken: DELPHI_READS_BOT_TOKEN,
  openaiApi: OPENAI_API_KEY,
  delphiApi: {
    apiKey: DELPHI_READS_API_KEY,
    baseUrl: DELPHI_API_BASE_URL,
    readingListId: DELPHI_READS_READING_LIST_ID,
  },
};

const bot = readsBot(readsBotConfiguration);

console.log('Configuration:', {
  DELPHI_API_BASE_URL,
  DELPHI_READS_WEBHOOK_URL,
  DELPHI_READS_BOT_TOKEN: mask(DELPHI_READS_BOT_TOKEN),
  DELPHI_READS_API_KEY: mask(DELPHI_READS_API_KEY),
});

const readsWebhookPath = '/webhooks/reads';
let botWebhookUrl = `${DELPHI_READS_WEBHOOK_URL}${readsWebhookPath}`;

const app = express();
const port = PORT || 5555;

if (DEV) {
  botWebhookUrl = DELPHI_READS_WEBHOOK_URL;

  // setup webhook proxy to local server
  const smee = new SmeeClient({
    source: DELPHI_READS_WEBHOOK_URL,
    target: `http://localhost:${port}${readsWebhookPath}`,
    logger: console,
  });

  await smee.start();
}

// log requests
app.use(audit({
  request: {
    maskHeaders: ['x-telegram-bot-api-secret-token']
  }
}));

// use this instead of createWebhook() so we can easily proxy thru smee locally
const secretToken = crypto.randomBytes(64).toString("hex");
app.use(bot.webhookCallback(readsWebhookPath, { secretToken }));
await bot.telegram.setWebhook(botWebhookUrl, { secret_token: secretToken });

// configure dev-only endpoints
if (DEV) {
  // for posting reads items to localhost when running locally
  app.post(`/reads`, (req, res) => {
    console.log('POST /reads', req.body);
    res.sendStatus(200);
  });
}

// Start Express Server
app.listen(port, () => {
  console.log(`Express server is listening on ${port}`);
});
