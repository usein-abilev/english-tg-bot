import { Injectable, NotFoundException } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { DeckEntity } from "../../common/entities/deck.entity";
import { AddCardQueryDto, CreateDeckDto, GetCardsQueryDto } from "./decks.dto";
import { CardEntity } from "../../common/entities/card.entity";
import { GetElementsResponse } from "../../common/types/response.types";
import { UserDeckEntity } from "../../common/entities/userDeck.entity";

@Injectable()
export class DecksService {
    constructor(
        private readonly dataSource: DataSource,
        @InjectRepository(DeckEntity)
        private readonly decksRepository: Repository<DeckEntity>,
        @InjectRepository(CardEntity)
        private readonly cardsRepository: Repository<CardEntity>,
        @InjectRepository(UserDeckEntity)
        private readonly userDecksRepository: Repository<UserDeckEntity>,
    ) {}

    async getUserDecks(userId: number) {
        return this.userDecksRepository.find({
            where: { user: { id: userId } },
            relations: { deck: true },
        });
    }

    async createDeck(params: CreateDeckDto) {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        const { manager } = queryRunner;

        try {
            const deckRepository = manager.getRepository(DeckEntity);
            const userDeckRepository = manager.getRepository(UserDeckEntity);

            const deck = await deckRepository.save({
                author: { id: params.userId },
                title: params.title.trim(),
                description: params.description.trim(),
            });

            const userDeck = await userDeckRepository.save({
                deck,
                user: { id: params.userId },
            });
            await queryRunner.commitTransaction();
            return userDeck;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async addCard(deckId: number, params: AddCardQueryDto) {
        const deck = await this.decksRepository.findOneBy({ id: deckId });
        if (!deck) {
            throw new NotFoundException("Deck not found");
        }

        const card = await this.cardsRepository.save(
            this.cardsRepository.create({
                deck: { id: deckId },
                term: params.term,
                definition: params.definition,
                description: params.description || "",
            }),
        );
        return card;
    }

    async getCards(
        deckId: number,
        params: GetCardsQueryDto,
    ): Promise<GetElementsResponse<CardEntity>> {
        const { page, limit } = params;

        const items = await this.cardsRepository.find({
            where: { deck: { id: deckId } },
            skip: page * limit,
            take: limit,
        });
        const total = await this.cardsRepository.count();

        return {
            items,
            pagination: {
                page,
                limit,
                total,
            },
        };
    }
}
