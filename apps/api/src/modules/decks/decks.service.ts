import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { Brackets, DataSource, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { DeckEntity } from "../../common/entities/deck.entity";
import {
    AddCardDto,
    CreateDeckDto,
    DeckExtendedDto,
    FindDecksQueryDto,
    GetCardsQueryDto,
    UpdateCardDto,
    UpdateDeckDto,
} from "./decks.dto";
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

    async get(deckId: number, userId: number): Promise<DeckExtendedDto> {
        const deck = await this.decksRepository
            .createQueryBuilder("deck")
            .leftJoinAndSelect("deck.author", "author")
            .loadRelationCountAndMap("deck.cardsCount", "deck.cards")
            .where("deck.id = :deckId", { deckId })
            .andWhere(
                new Brackets((qb) => {
                    qb.where("deck.public = :public", { public: true }).orWhere(
                        "deck.authorId = :userId",
                        { userId },
                    );
                }),
            )
            .getOne();

        if (!deck) {
            throw new NotFoundException("Deck not found");
        }

        const progressData = await this.userDecksRepository
            .createQueryBuilder("user_deck")
            .select("COUNT(CASE WHEN progress.nextReviewAt <= :now THEN 1 END)", "due_cards_count")
            .addSelect(
                "COUNT(CASE WHEN progress.repetitions IS NULL THEN 1 END)",
                "new_cards_count",
            )
            .addSelect("MIN(progress.nextReviewAt)", "next_review_at")
            .leftJoin(CardEntity, "card", "card.deckId = user_deck.deckId")
            .leftJoin(
                "user_card_progress",
                "progress",
                "progress.cardId = card.id AND progress.userId = :userId",
            )
            .where("user_deck.userId = :userId", { userId })
            .andWhere("user_deck.deckId = :deckId", { deckId })
            .setParameters({ now: new Date(), userId, deckId: deck.id })
            .groupBy("user_deck.id")
            .addGroupBy("user_deck.deckId")
            .getRawOne();

        return {
            ...deck,
            progress: progressData && {
                cardsToLearnCount: Math.min(deck.cardsCount!, progressData.new_cards_count),
                cardsToReviewCount: Math.min(deck.cardsCount!, progressData.due_cards_count),
                lastReviewAt: progressData.user_deck_lastReviewAt,
                nextReviewAt: progressData.next_review_at,
            },
        };
    }

    /**
     * Find public decks with pagination
     */
    async find(params: FindDecksQueryDto): Promise<GetElementsResponse<DeckExtendedDto>> {
        const { page = 0, limit = 50 } = params;

        const query = this.decksRepository
            .createQueryBuilder("deck")
            .leftJoinAndSelect("deck.author", "author")
            .loadRelationCountAndMap("deck.cardsCount", "deck.cards")
            .where("deck.public = :public", { public: true })
            .skip(page * limit)
            .take(limit);

        const [items, total] = await query.getManyAndCount();

        return {
            items,
            pagination: {
                page,
                limit,
                total,
            },
        };
    }

    /**
     * Adds a deck to user's favorites
     */
    async addFavoriteDeck(deckId: number, userId: number) {
        const deck = await this.decksRepository.findOneBy({ id: deckId });
        if (!deck) {
            throw new NotFoundException("Deck not found");
        }
        if (deck.authorId === userId) {
            throw new BadRequestException("You can't add your own deck to favorites");
        }
        const userDeck = await this.userDecksRepository.save({
            deck,
            user: { id: userId },
        });
        return userDeck;
    }

    /**
     * Creates a new deck
     */
    async createDeck(params: CreateDeckDto): Promise<DeckExtendedDto> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        const { manager } = queryRunner;

        try {
            const deckRepository = manager.getRepository(DeckEntity);
            const cardRepository = manager.getRepository(CardEntity);
            const userDeckRepository = manager.getRepository(UserDeckEntity);

            const deck = await deckRepository.save({
                author: { id: params.userId },
                title: params.title.trim(),
                description: params.description.trim(),
            });

            if (Array.isArray(params.cards)) {
                await cardRepository.save(
                    params.cards.map((card) => ({
                        deck: { id: deck.id },
                        term: card.term,
                        definition: card.definition,
                        description: card.description || "",
                    })),
                );
            }

            await userDeckRepository.save({
                deck,
                user: { id: params.userId },
            });
            await queryRunner.commitTransaction();
            return { ...deck, cardsCount: 0 };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    /**
     * Updates a deck
     */
    async updateDeck(id: number, params: UpdateDeckDto): Promise<void> {
        const deck = await this.decksRepository.findOneBy({ id });
        if (!deck) {
            throw new NotFoundException("Deck not found");
        }
        if (deck.authorId !== params.userId) {
            throw new ForbiddenException("You are not allowed to update this deck");
        }
        await this.decksRepository.update(
            { id },
            {
                title: params.title,
                description: params.description,
                ...(params.public !== undefined && { public: params.public }),
            },
        );
    }

    /**
     * Deletes a deck and all its cards
     */
    async deleteDeck(deckId: number, userId: number) {
        const deck = await this.decksRepository.findOne({
            where: { id: deckId },
            relations: { author: true },
        });
        if (!deck) {
            throw new NotFoundException("Deck not found");
        }
        if (deck.authorId !== userId) {
            throw new ForbiddenException("You are not allowed to delete this deck");
        }
        await this.decksRepository.delete({ id: deckId });
    }

    async addCard(deckId: number, params: AddCardDto) {
        const deck = await this.decksRepository.findOneBy({ id: deckId });
        if (!deck) {
            throw new NotFoundException("Deck not found");
        }
        if (deck.authorId !== params.userId) {
            throw new ForbiddenException("You are not allowed to add cards to this deck");
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

    async updateCard(id: number, params: UpdateCardDto) {
        const card = await this.cardsRepository.findOne({
            where: { id, deckId: params.deckId, deck: { authorId: params.userId } },
            relations: { deck: true },
        });
        if (!card) {
            throw new NotFoundException("Card not found");
        }

        await this.cardsRepository.update(
            { id },
            {
                term: params.term,
                definition: params.definition,
                description: params.description,
            },
        );
    }

    async deleteCard(deckId: number, cardId: number, userId: number) {
        const deck = await this.decksRepository.findOneBy({ id: deckId });
        if (!deck) {
            throw new NotFoundException("Deck not found");
        }
        if (deck.authorId !== userId) {
            throw new ForbiddenException("You are not allowed to delete cards from this deck");
        }

        await this.cardsRepository.delete({ id: cardId });
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
        const total = await this.cardsRepository.count({
            where: { deck: { id: deckId } },
        });

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
