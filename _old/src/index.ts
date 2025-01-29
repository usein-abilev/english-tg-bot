import "reflect-metadata";

import LanguageBotAPI from "./api";
import initializeTgBot from "./bot";
import initializeDatabase from "./api/db";
import PracticeObserver from "./api/observer";

(async () => {
    const dataSource = await initializeDatabase();
    const api = new LanguageBotAPI(dataSource);
    const observer = new PracticeObserver(api);

    // Start the practice observer
    observer.start();

    await initializeTgBot(api);
})();
