import "reflect-metadata";
import { DataSource } from "typeorm";
import appConfig from "../../appConfig";
import path from "node:path";

const ENTITIES_PATH = path.join(__dirname, "/entities/*.entity.{ts,js}");
const MIGRATION_PATH = path.join(__dirname, "/migrations/*{.ts,.js}");

const dataSource = new DataSource({
    type: "postgres",
    poolSize: 10,
    host: appConfig.database.host,
    port: appConfig.database.port,
    database: appConfig.database.name,
    username: appConfig.database.username,
    password: appConfig.database.password,
    entities: [ENTITIES_PATH],
    migrations: [MIGRATION_PATH],
    migrationsRun: true,
});

export default dataSource;
