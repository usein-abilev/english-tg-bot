import { logger } from "../../utils/logger.util";
import dataSource from "./dataSource";
import { runSeeds } from "./seeds/seed";

export default async function initializeDatabase() {
    logger.info("Connecting to database...");
    while (!dataSource.isInitialized) {
        await dataSource.initialize().catch((error) => {
            logger.error("Failed to initialize database connection:", error);
        });
        await new Promise((resolve) => setTimeout(resolve, 3000));
    }
    logger.info("Database connected successfully");

    if (process.env.NODE_ENV !== "production") {
        logger.info("Synchronizing database schema...");
        await dataSource.synchronize();
    }

    logger.info("Running database migrations...");
    await dataSource.runMigrations().catch((error) => {
        console.error("Failed to run database migrations:", error);
    });

    logger.info("Running database seeds...");
    await runSeeds(dataSource).catch((error) => {
        console.error("Failed to run database seeds:", error);
    });

    return dataSource;
}
