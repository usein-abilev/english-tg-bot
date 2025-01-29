import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import appConfig from "./configs/app.config";
import { UsersModule } from "./modules/users/users.module";
import { DecksModule } from "./modules/decks/decks.module";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: appConfig.database.type,
            host: appConfig.database.host,
            port: appConfig.database.port,
            database: appConfig.database.name,
            username: appConfig.database.username,
            password: appConfig.database.password,
            entities: [path.resolve(__dirname, "./common/entities/*.entity{.ts,.js}")],
            synchronize: process.env.NODE_ENV === "development",
        }),
        UsersModule,
        DecksModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
