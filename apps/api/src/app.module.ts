import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

import appConfig from "./configs/app.config";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./modules/users/users.module";
import { DecksModule } from "./modules/decks/decks.module";
import { PracticeModule } from "./modules/practice/practice.module";
import { DictionaryModule } from "./modules/dictionary/dictionary.module";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            parseInt8: true, // because userId is int8 in the database
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
        PracticeModule,
        DictionaryModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
