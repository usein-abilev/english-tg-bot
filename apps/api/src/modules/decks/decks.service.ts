import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { DeckEntity } from "../../common/entities/deck.entity";
import { CreateDeckDto } from "./decks.dto";

@Injectable()
export class DecksService {
    constructor(
        @InjectRepository(DeckEntity)
        private readonly decksRepository: Repository<DeckEntity>,
    ) {}

    async getByUserId(userId: number) {
        return this.decksRepository.find({
            where: {
                author: { id: userId },
            },
        });
    }

    async create(params: CreateDeckDto) {
        const entity = this.decksRepository.create({
            author: { id: params.userId },
            title: params.title,
            description: params.description,
        });
        return this.decksRepository.save(entity);
    }
}
