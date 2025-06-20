import { DataSource, EntityManager } from "typeorm";
import fs from "fs/promises";
import { createChildLogger } from "../../../utils/logger.util";

const logger = createChildLogger("database-seeds");

export interface TypeORMSeed {
    up(manager: EntityManager): Promise<void>;
    down(manager: EntityManager): Promise<void>;
}

const parseSeedFilename = (filename: string): { timestamp: number; name: string } => {
    const dashIndex = filename.indexOf("-");
    const dotIndex = filename.lastIndexOf(".");
    return {
        timestamp: parseInt(filename.slice(0, dashIndex)),
        name: filename.slice(dashIndex + 1, dotIndex),
    };
};

interface SeedRecord {
    name: string;
    filename: string;
    timestamp: number;
}

export async function runSeeds(dataSource: DataSource): Promise<void> {
    const runner = dataSource.createQueryRunner();
    await runner.connect();

    await runner.query(`
        CREATE TABLE IF NOT EXISTS "seeds" (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            timestamp INT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    `);

    const processedSeeds = await runner.query(`SELECT name, timestamp FROM "seeds"`);

    logger.debug(
        "Processed seeds (%i): %o",
        processedSeeds.length,
        processedSeeds.map((seed: SeedRecord) => seed.name),
    );

    const seedFiles = await fs.readdir(__dirname);
    const unprocessedFiles = seedFiles
        .filter((file) => file.endsWith(".js") && file.includes("-") && file !== "seed.js")
        .map((file) => {
            const { timestamp, name } = parseSeedFilename(file);
            const processed = processedSeeds.some(
                (seed: SeedRecord) => seed.name === name && seed.timestamp === timestamp,
            );
            if (processed) return null;
            return { name, timestamp, filename: file };
        })
        .filter((file) => file !== null) as SeedRecord[];

    const seeds = await Promise.all(
        unprocessedFiles.map(async ({ name, timestamp, filename }) => {
            const module = await import(`./${filename}`);
            if (!module.default) {
                throw new Error(`Seed file '${filename}' does not have a default export`);
            }
            return { name, timestamp, filename, module: new module.default() as TypeORMSeed };
        }),
    );
    seeds.sort((a, b) => a.timestamp - b.timestamp);

    await runner.startTransaction();
    let currentSeed = null;
    try {
        for (const seed of seeds) {
            logger.debug("Running seed '%s'", seed.name);
            currentSeed = seed;
            await seed.module.up(runner.manager);
            console.log("Migration ended");
            await runner.query(`INSERT INTO "seeds" (name, timestamp) VALUES ($1, $2)`, [
                seed.name,
                seed.timestamp,
            ]);
        }
        await runner.commitTransaction();
    } catch (error) {
        logger.error("Failed on seed '%s': %o", currentSeed!.filename, error);
        await runner.rollbackTransaction();
    }
}
