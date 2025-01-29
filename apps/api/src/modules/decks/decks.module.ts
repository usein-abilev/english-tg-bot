import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DecksController } from "./decks.controller";
import { DecksService } from "./decks.service";
import { DeckEntity } from "../../common/entities/deck.entity";

@Module({
    imports: [TypeOrmModule.forFeature([DeckEntity])],
    controllers: [DecksController],
    providers: [DecksService],
    exports: [DecksService],
})
export class DecksModule {}
