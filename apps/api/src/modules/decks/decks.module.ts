import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DecksController } from "./decks.controller";
import { DecksService } from "./decks.service";
import { DeckEntity } from "../../common/entities/deck.entity";
import { CardEntity } from "../../common/entities/card.entity";
import { UserDeckEntity } from "../../common/entities/userDeck.entity";
import { UserCardProgressEntity } from "../../common/entities/userCardProgress.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([DeckEntity, CardEntity, UserDeckEntity, UserCardProgressEntity]),
    ],
    controllers: [DecksController],
    providers: [DecksService],
    exports: [DecksService],
})
export class DecksModule {}
