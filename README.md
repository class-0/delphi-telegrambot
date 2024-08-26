# delphi-tg-bots

Delphi Reads Telegram Bot powers creation of Delphi Reads items by Delphi research analysts

## Local Development

Install deps

```bash
npm i
```

Generate your [telegram bot](https://core.telegram.org/bots/tutorial) for local dev. 

Create a [smee channel](https://smee.io/new) to proxy webhook requests to your local server. Copy 
the generated smee channel url as you'll need to save it as `DELPHI_READS_WEBHOOK_URL` in your 
`.env` file.

Copy `.env.template` to `.env` file:

```bash
cp .env.template .env
```

Open `.env` and populate values.

Start the server in dev mode:

```bash
npm run start:dev
```

Dev mode will automatically configure smee to proxy requests to your local server.

## Bot Commands

Use BotFather to set commands for your bot.

1. In conversation with BotFather:

```
/setcommands
```

2. Then, select the bot to set commands for

3. Finally, add all your commands. Below could be used for the Delphi Reads bot:

```
help - Get help or provide feedback
new - Create a new Delphi Read item
publish - Publish your Delphi Read item to the portal
preview - View preview of your current Delphi Read item
setdescription - Set the description for your current Delphi Read item
settitle - Set the title for your current Delphi Read item
settype - Set the type for your current Delphi Read item
setsector - Set the sector for your current Delphi Read item
```

## Deployment


```
# deploy to beta/staging environment
npm run deploy

# deploy to prod
npm run deploy:prod
```

## Resources

[Telegraf Docs](https://github.com/feathers-studio/telegraf-docs)
