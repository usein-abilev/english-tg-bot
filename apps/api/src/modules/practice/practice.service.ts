import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeckEntity } from "../../common/entities/deck.entity";
import { Brackets, DataSource, In, Repository } from "typeorm";
import { CardEntity } from "../../common/entities/card.entity";
import { UserDeckEntity } from "../../common/entities/userDeck.entity";
import {
    BatchRateCardDto,
    PracticeGetCardsQueryDto,
    PracticeGetDecksQueryDto,
} from "./practice.dto";
import calcSuperMemo2 from "../../common/utils/calcSM2.util";
import { UserCardProgressEntity } from "../../common/entities/userCardProgress.entity";
import { DeckExtendedDto } from "../decks/decks.dto";
import { GetElementsResponse } from "../../common/types/response.types";

@Injectable()
export class PracticeService {
    private readonly logger = new Logger(PracticeService.name);

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
    ): Promise<DeckExtendedDto[]> {
        const subQuery = this.userDecksRepository
            .createQueryBuilder("inner")
            .select("inner.deckId", "deckId")
            .addSelect("COUNT(card.id)", "cards_count")
            .addSelect(
                "COUNT(CASE WHEN progress.nextReviewAt <= :now THEN 1 END)",
                "due_cards_count",
            )
            .addSelect(
                "COUNT(CASE WHEN progress.repetitions IS NULL THEN 1 END)",
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

        return raw.map((item) => {
            return {
                id: item.deck_id,
                title: item.deck_title,
                description: item.deck_description,
                authorId: item.deck_authorId,
                public: item.deck_public,
                createdAt: item.deck_createdAt && new Date(item.deck_createdAt),
                updatedAt: item.deck_updatedAt && new Date(item.deck_updatedAt),
                progress: {
                    cardsCount: +item.cards_count,
                    cardsToReviewCount: +item.due_cards_count,
                    cardsToLearnCount: Math.min(+item.new_cards_count, +item.cards_count),
                    lastReviewAt:
                        item.user_deck_lastReviewAt && new Date(item.user_deck_lastReviewAt),
                    nextReviewAt: item.next_review_at && new Date(item.next_review_at),
                },
            } satisfies DeckExtendedDto;
        });
    }

    async getCardsToPractice(
        userId: number,
        params: PracticeGetCardsQueryDto,
    ): Promise<GetElementsResponse<CardEntity>> {
        const { page, limit } = params;

        const query = this.cardsRepository
            .createQueryBuilder("card")
            .innerJoin(
                UserDeckEntity,
                "user_deck",
                "user_deck.userId = :userId AND user_deck.deckId = card.deckId",
            )
            .leftJoinAndSelect("card.deck", "deck")
            .leftJoin(
                UserCardProgressEntity,
                "progress",
                "progress.cardId = card.id AND progress.userId = :userId",
            )
            .andWhere(
                new Brackets((qb) =>
                    qb
                        .where("progress.nextReviewAt IS NULL")
                        .orWhere("progress.nextReviewAt <= :now"),
                ),
            )
            .addSelect("progress.nextReviewAt", "progress_next_review_at")
            .addOrderBy("progress_next_review_at", "ASC")
            .take(limit)
            .skip(page * limit)
            .setParameters({ userId, now: new Date() });

        if (params.deckId) {
            query.andWhere("card.deckId = :deckId", { deckId: params.deckId });
        }

        const [cards, total] = await query.getManyAndCount();

        return {
            items: cards,
            pagination: {
                limit,
                page,
                total,
            },
        };
    }

    async getUserPracticeCounters(userId: number) {
        const query = this.userDecksRepository
            .createQueryBuilder("user_deck")
            .select("COUNT(DISTINCT(card.id))", "total_count")
            .addSelect("COUNT(DISTINCT(user_deck.deckId))", "decks_practice_count")
            .addSelect(
                "COUNT(CASE WHEN progress.nextReviewAt <= :now THEN progress.id END)",
                "review_count",
            )
            .addSelect("COUNT(CASE WHEN progress.repetitions IS NULL THEN 1 END)", "learn_count")
            .leftJoin(CardEntity, "card", "card.deckId = user_deck.deckId")
            .leftJoin(
                "user_card_progress",
                "progress",
                "progress.cardId = card.id AND progress.userId = :userId",
            )
            .where("user_deck.userId = :userId")
            .setParameters({ userId, now: new Date() });

        const result = await query.getRawOne();

        return {
            cardsTotal: result.total_count,
            cardsToLearnCount: result.learn_count,
            cardsToReviewCount: result.review_count,
            cardsToPracticeCount: result.learn_count + result.review_count,
            decksToPracticeCount: result.decks_practice_count,
        };
    }

    /**
     * Rates a batch of cards using the spaced repetition system
     */
    async rateCards(params: BatchRateCardDto) {
        const { userId } = params;

        const cardIds = params.cards.map((card) => card.cardId);
        const existsCards = await this.cardsRepository.find({
            where: { id: In(cardIds) },
            select: { id: true, deckId: true },
        });
        const existsCardsToDeckMap = new Map(existsCards.map((card) => [card.id, card.deckId]));
        const detailedCards = params.cards
            .map((card) => {
                const deckId = existsCardsToDeckMap.get(card.cardId);
                return { ...card, deckId };
            })
            .filter((card) => card.deckId);

        await this.userCardProgressRepository
            .createQueryBuilder()
            .insert()
            .into(UserCardProgressEntity)
            .values(
                detailedCards.map((card) => ({
                    userId,
                    cardId: card.cardId,
                    deckId: card.deckId,
                    easinessFactor: 1.3,
                    repetitions: 0,
                    interval: 0,
                    nextReviewAt: new Date(),
                })),
            )
            .orIgnore()
            .execute();

        const cardProgresses = await this.userCardProgressRepository.find({
            where: {
                userId,
                cardId: In(cardIds),
            },
            select: {
                id: true,
                cardId: true,
                easinessFactor: true,
                repetitions: true,
                interval: true,
                nextReviewAt: true,
                lastGrade: true,
                streakCount: true,
            },
        });

        if (cardProgresses.length !== existsCards.length) {
            throw new NotFoundException("Some cards not found");
        }

        const cardsGradesMap = new Map(detailedCards.map((card) => [card.cardId, card.grade]));

        const updatedProgresses = cardProgresses.map((cardProgress) => {
            const grade = cardsGradesMap.get(cardProgress.cardId);
            const sm = calcSuperMemo2(
                grade + 1,
                cardProgress.repetitions + 1,
                cardProgress.interval,
                cardProgress.easinessFactor,
            );
            cardProgress.easinessFactor = sm.easinessFactor;
            cardProgress.repetitions = sm.repetitions;
            cardProgress.interval = sm.interval;
            cardProgress.nextReviewAt = new Date(Date.now() + sm.interval);

            // update streak count and last grade
            const currStreak = grade === cardProgress.lastGrade ? cardProgress.streakCount + 1 : 1;
            cardProgress.streakCount = currStreak;
            cardProgress.lastGrade = grade;

            return cardProgress;
        });

        const values = updatedProgresses
            .map(
                (p) => `(${p.id}, ${p.easinessFactor}, ${p.repetitions}, ${p.interval},
                    ${p.lastGrade}, ${p.streakCount}, '${p.nextReviewAt.toISOString()}'::timestamp)`,
            )
            .join(", ");

        const queryRunner = this.dataSource.createQueryRunner();
        try {
            await queryRunner.query(`
            UPDATE user_card_progress AS ucp
            SET 
                "easinessFactor" = data.easinessFactor,
                repetitions = data.repetitions,
                interval = data.interval,
                "nextReviewAt" = data.nextReviewAt,
                "lastGrade" = data.lastGrade,
                "streakCount" = data.streakCount
            FROM (VALUES ${values}) AS data (id, easinessFactor, repetitions, interval, lastGrade, streakCount, nextReviewAt)
            WHERE ucp.id = data.id;

            UPDATE user_deck AS ud
            SET "lastReviewAt" = NOW()
            WHERE "userId" = ${userId} AND "deckId" IN (
                SELECT DISTINCT "deckId" FROM cards WHERE id IN (${cardIds.join(", ")})
            )
        `);
        } finally {
            await queryRunner.release();
        }
    }
}
