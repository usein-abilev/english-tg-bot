import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeckEntity } from "../../common/entities/deck.entity";
import { DataSource, Repository } from "typeorm";
import { CardEntity } from "../../common/entities/card.entity";
import { UserDeckEntity } from "../../common/entities/userDeck.entity";
import {
    PracticeDecksResponse,
    PracticeGetDecksQueryDto,
    PracticeRateCardDto,
} from "./practice.dto";
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

    async getDecksToPractice(
        userId: number,
        params: PracticeGetDecksQueryDto,
    ): Promise<PracticeDecksResponse[]> {
        const subQuery = this.userDecksRepository
            .createQueryBuilder("inner")
            .select("inner.deckId", "deckId")
            .addSelect("COUNT(card.id)", "cards_count")
            .addSelect(
                "COUNT(CASE WHEN progress.nextReviewAt <= :now THEN 1 END)",
                "due_cards_count",
            )
            .addSelect(
                "COUNT(CASE WHEN progress.repetitions = 0 OR progress.repetitions IS NULL THEN 1 END)",
                "new_cards_count",
            )
            .addSelect("MIN(progress.nextReviewAt)", "next_review_at")
            .leftJoin(CardEntity, "card", "card.deckId = inner.deckId")
            .leftJoin(
                "user_card_progress",
                "progress",
                "progress.cardId = card.id AND progress.userId = :userId",
                { userId },
            )
            .where("inner.userId = :userId", { userId })
            .groupBy("inner.deckId");

        const query = this.userDecksRepository
            .createQueryBuilder("user_deck")
            .innerJoin(`(${subQuery.getQuery()})`, "stats", `stats."deckId" = "user_deck"."deckId"`)
            .leftJoinAndSelect("user_deck.deck", "deck")
            .addSelect("stats.cards_count", "cards_count")
            .addSelect("stats.due_cards_count", "due_cards_count")
            .addSelect("stats.next_review_at", "next_review_at")
            .addSelect("stats.new_cards_count", "new_cards_count")
            .orderBy("stats.next_review_at", "ASC")
            .limit(params.limit)
            .setParameters({ now: new Date(), userId });

        const raw = await query.getRawMany();

        return raw.map((item) => ({
            id: item.deck_id,
            title: item.deck_title,
            description: item.deck_description,
            authorId: item.deck_authorId,
            createdAt: item.deck_createdAt && new Date(item.deck_createdAt),
            lastReviewAt: item.user_deck_lastReviewAt && new Date(item.user_deck_lastReviewAt),
            nextReviewAt: item.next_review_at && new Date(item.next_review_at),
            stats: {
                cardsCount: +item.cards_count,
                // Ensure that new cards count is not greater than the total cards count
                // Because without it, if in the deck there are no cards with progress, the new cards count will be equal to 1.
                newCardsCount: Math.min(+item.new_cards_count, +item.cards_count),
                dueCardsCount: +item.due_cards_count,
            },
        }));
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
                    // nextReviewAt: () =>
                    //     `LEAST(
                    //     (SELECT MIN("nextReviewAt") FROM "user_card_progress" WHERE "userId" = ${userId} AND "cardId" = ${cardId}),
                    //     '${cardProgress.nextReviewAt.toISOString()}'
                    // )`,
                },
            ),
        ]);

        return result;
    }
}
