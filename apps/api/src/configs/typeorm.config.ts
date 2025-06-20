import * as path from "path";
import { config } from "dotenv";
import { DataSource } from "typeorm";

config({ path: path.resolve(__dirname, "../../../../.env") });

import appConfig from "./app.config";

const AppDataSource = new DataSource({
    parseInt8: true, // because userId is int8 in the database
    type: appConfig.database.type,
    host: appConfig.database.host,
    port: appConfig.database.port,
    database: appConfig.database.name,
    username: appConfig.database.username,
    password: appConfig.database.password,
    entities: [path.resolve(__dirname, "../common/entities/*.entity{.ts,.js}")],
    migrations: [path.resolve(__dirname, "../migrations/*{.ts,.js}")],
    migrationsRun: false,
    synchronize: false,
    logging: true,
});

export default AppDataSource;
