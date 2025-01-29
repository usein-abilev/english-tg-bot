import { Module } from "@nestjs/common";
import { CardsController } from "./cards.controller";
import { CardsService } from "./cards.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CardEntity } from "../../common/entities/card.entity";

@Module({
    imports: [TypeOrmModule.forFeature([CardEntity])],
    controllers: [CardsController],
    providers: [CardsService],
})
export class CardsModule {}
