import "reflect-metadata";

import LanguageBotAPI from "./api";
import initializeTgBot from "./bot";
import initializeDatabase from "./api/db";

(async () => {
    const dataSource = await initializeDatabase();
    const api = new LanguageBotAPI(dataSource);
    await initializeTgBot(api);
})();
