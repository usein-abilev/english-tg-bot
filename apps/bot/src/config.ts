const botConfig = {
    botToken: process.env.TG_BOT_TOKEN,
    botUsername: process.env.TG_BOT_USERNAME,
    webAppUrl: process.env.WEB_APP_URL,
    apiUrl: process.env.API_URL,
};

export type BotConfig = typeof botConfig;

export default botConfig;
