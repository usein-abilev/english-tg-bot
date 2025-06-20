import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../../common/entities/user.entity";
import { DecksModule } from "../decks/decks.module";
import { PracticeModule } from "../practice/practice.module";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), DecksModule, PracticeModule],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule {}
