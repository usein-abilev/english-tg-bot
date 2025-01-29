import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CardEntity } from "../../common/entities/card.entity";

@Injectable()
export class CardsService {
    constructor(
        @InjectRepository(CardEntity)
        private readonly cardsRepository: Repository<CardEntity>,
    ) {}

    async getAll() {
        return await this.cardsRepository.find();
    }
}
