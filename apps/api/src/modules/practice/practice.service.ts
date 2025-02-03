import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeckEntity } from "../../common/entities/deck.entity";
import { DataSource, LessThanOrEqual, Repository } from "typeorm";
import { CardEntity } from "../../common/entities/card.entity";
import { UserDeckEntity } from "../../common/entities/userDeck.entity";
import { PracticeRateCardDto } from "./practice.dto";
import calcSuperMemo2 from "../../common/utils/calcSM2.util";
import { UserCardProgressEntity } from "../../common/entities/userCardProgress.entity";

@Injectable()
export class PracticeService {
    constructor(
        private readonly dataSource: DataSource,
        @InjectRepository(DeckEntity)
        private readonly decksRepository: Repository<DeckEntity>,
        @InjectRepository(CardEntity)
        private readonly cardsRepository: Repository<CardEntity>,
        @InjectRepository(UserDeckEntity)
        private readonly userDecksRepository: Repository<UserDeckEntity>,
        @InjectRepository(UserCardProgressEntity)
        private readonly userCardProgressRepository: Repository<UserCardProgressEntity>,
    ) {}

    async getDecksToPractice(userId: number, limit?: number): Promise<UserDeckEntity[]> {
        const filter = { userId, nextReviewAt: LessThanOrEqual(new Date()) };
        const items = await this.userDecksRepository.find({
            where: filter,
            relations: { deck: true },
            take: limit || undefined,
            order: { nextReviewAt: "ASC" },
        });
        return items;
    }

    /**
     * Rates the card using the spaced repetition system
     */
    async rateCard(params: PracticeRateCardDto) {
        const { userId, cardId, grade } = params;

        const card = await this.cardsRepository.findOne({
            where: { id: cardId },
            select: { id: true, deckId: true },
        });
        if (!card) {
            throw new NotFoundException("Card not found");
        }

        await this.userCardProgressRepository
            .createQueryBuilder()
            .insert()
            .into(UserCardProgressEntity)
            .values({
                userId,
                cardId,
                easinessFactor: 1.3,
                repetitions: 0,
                interval: 0,
                nextReviewAt: new Date(),
            })
            .orIgnore()
            .execute();

        const cardProgress = await this.userCardProgressRepository.findOneBy({
            userId,
            cardId,
        });

        const sm = calcSuperMemo2(
            grade,
            cardProgress.repetitions + 1,
            cardProgress.interval,
            cardProgress.easinessFactor,
        );
        cardProgress.easinessFactor = sm.easinessFactor;
        cardProgress.repetitions = sm.repetitions;
        cardProgress.interval = sm.interval;
        cardProgress.nextReviewAt = new Date(Date.now() + sm.interval);

        const [result] = await Promise.all([
            this.userCardProgressRepository.save(cardProgress),
            this.userDecksRepository.update(
                { userId, deckId: card.deckId },
                {
                    lastReviewAt: new Date(),
                    nextReviewAt: () =>
                        `LEAST(
                        (SELECT MIN("nextReviewAt") FROM "user_card_progress" WHERE "userId" = ${userId} AND "cardId" = ${cardId}),
                        '${cardProgress.nextReviewAt.toISOString()}'
                    )`,
                },
            ),
        ]);

        return result;
    }
}
