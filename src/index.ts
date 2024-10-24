import "reflect-metadata";
import { DataSource } from "typeorm";
import appConfig from "./appConfig";
import LanguageBotAPI from "./api";
import initializeTgBot from "./bot";
import UserEntity from "./api/db/entities/user.entity";
import UserCardEntity from "./api/db/entities/card.entity";
import { logger } from "./utils/logger.util";

(async () => {
    const dataSource = new DataSource({
        type: "postgres",
        poolSize: 10,
        host: appConfig.database.host,
        port: appConfig.database.port,
        database: appConfig.database.name,
        username: appConfig.database.username,
        password: appConfig.database.password,
        entities: [UserEntity, UserCardEntity],
        synchronize: true,
    });
    while (!dataSource.isInitialized) {
        await dataSource.initialize().catch((error) => {
            console.error("Failed to initialize database connection:", error);
        });
        await new Promise((resolve) => setTimeout(resolve, 3000));
    }
    logger.info("Database connected successfully", appConfig.database);
    const api = new LanguageBotAPI(dataSource);
    await initializeTgBot(api);
})();
