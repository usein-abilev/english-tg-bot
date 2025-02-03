import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DeckEntity } from "../../common/entities/deck.entity";
import { CardEntity } from "../../common/entities/card.entity";
import { UserDeckEntity } from "../../common/entities/userDeck.entity";
import { UserCardProgressEntity } from "../../common/entities/userCardProgress.entity";
import { PracticeController } from "./practice.controller";
import { PracticeService } from "./practice.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([DeckEntity, CardEntity, UserDeckEntity, UserCardProgressEntity]),
    ],
    controllers: [PracticeController],
    providers: [PracticeService],
    exports: [PracticeService],
})
export class PracticeModule {}
