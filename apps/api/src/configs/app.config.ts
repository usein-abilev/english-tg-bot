const appConfig = {
    webURL: process.env.WEB_APP_URL as string,
    telegram: {
        token: process.env.TG_BOT_TOKEN as string,
        username: process.env.TG_BOT_USERNAME as string,
    },
    database: {
        type: "postgres",
        name: process.env.DB_NAME as string,
        host: process.env.DB_HOST as string,
        port: parseInt(process.env.DB_PORT as string),
        username: process.env.DB_USERNAME as string,
        password: process.env.DB_PASSWORD as string,
    },
    translation: {
        host: process.env.TRANSLATION_HOST as string,
        port: parseInt(process.env.TRANSLATION_PORT as string),
    },
    dictionary: {
        url: process.env.DICTIONARY_API_URL as string,
    },
} as const;

export type AppConfig = typeof appConfig;
export default appConfig;
