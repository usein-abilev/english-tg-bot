import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeckEntity } from "../../common/entities/deck.entity";
import { Brackets, DataSource, DeepPartial, In, Repository } from "typeorm";
import { CardEntity } from "../../common/entities/card.entity";
import { UserDeckEntity } from "../../common/entities/userDeck.entity";
import {
    BatchRateCardDto,
    FinalizePracticeDto,
    GetPracticeStatsDto,
    PracticeGetCardsQueryDto,
    PracticeGetDecksQueryDto,
    PracticeSessionResult as PracticeSessionResultDto,
} from "./practice.dto";
import calcSuperMemo2 from "../../common/utils/calcSM2.util";
import { UserCardProgressEntity } from "../../common/entities/userCardProgress.entity";
import { DeckExtendedDto } from "../decks/decks.dto";
import { GetElementsResponse } from "../../common/types/response.types";
import { DeckPracticeSessionEntity } from "../../common/entities/deckPracticeSession.entity";

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
        @InjectRepository(DeckPracticeSessionEntity)
        private readonly deckPracticeSessionRepository: Repository<DeckPracticeSessionEntity>,
    ) {}

    async getPracticeStats(params: GetPracticeStatsDto) {
        const { userId, range, deckIds } = params;

        const ranges = {
            daily: "DATE(session.createdAt)",
            weekly: "DATE_TRUNC('week', session.createdAt)",
        };

        const query = this.deckPracticeSessionRepository
            .createQueryBuilder("session")
            .select([
                `${ranges[range]} AS date`,
                "SUM(session.learnedCardsCount) AS learned_cards_count",
                "SUM(session.difficultCardsCount) AS difficult_cards_count",
                "AVG(session.averageGrade) AS average_grade",
                "AVG(session.averageEasinessFactor) AS average_easiness_factor",
                "AVG(session.averageInterval) AS average_interval",
                "SUM(session.totalCardsCount) AS total_cards_count",
            ])
            .where("session.userId = :userId", { userId })
            .andWhere((qb) => {
                const subQuery = qb
                    .subQuery()
                    .select([
                        "DISTINCT ON (session.deckId, DATE(session.createdAt)) session.id",
                        "session.deckId",
                        "DATE(session.createdAt) AS date",
                    ])
                    .from(DeckPracticeSessionEntity, "session")
                    .where("session.userId = :userId", { userId })
                    .orderBy("session.deckId, DATE(session.createdAt), session.createdAt", "DESC")
                    .getQuery();

                return "session.id IN " + subQuery;
            })
            .groupBy("date")
            .orderBy("date", "ASC");

        if (deckIds?.length) {
            query.andWhere("session.deckId IN :...deckIds", { deckIds });
        }

        return await query.getRawMany();
    }

    async finalizePractice(params: FinalizePracticeDto): Promise<PracticeSessionResultDto[]> {
        const results = await this.getPracticeResults(params);

        await this.deckPracticeSessionRepository.save(results.map((result) => result.current));

        return results;
    }

    // TODO: Unused right now, remove
    async getDecksToPractice(
        userId: number,
        params?: PracticeGetDecksQueryDto,
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
            .leftJoinAndSelect("deck.author", "author")
            .addSelect("stats.cards_count", "cards_count")
            .addSelect("stats.due_cards_count", "due_cards_count")
            .addSelect("stats.next_review_at", "next_review_at")
            .addSelect("stats.new_cards_count", "new_cards_count")
            .orderBy("stats.next_review_at", "ASC")
            .where("user_deck.userId = :userId", { userId })
            .limit(params?.limit || 0)
            .setParameters({ now: new Date(), userId });

        const result = await query.getRawAndEntities();

        const items: DeckExtendedDto[] = result.entities.map((userDeck) => {
            const progress = result.raw.find((item) => item.deck_id === userDeck.deck.id);
            return {
                ...userDeck.deck,
                cardsCount: +progress.cards_count,
                progress: {
                    cardsToReviewCount: +progress.due_cards_count,
                    cardsToLearnCount: Math.min(+progress.new_cards_count, +progress.cards_count),
                    lastReviewAt:
                        progress.user_deck_lastReviewAt &&
                        new Date(progress.user_deck_lastReviewAt),
                    nextReviewAt: progress.next_review_at && new Date(progress.next_review_at),
                },
            } satisfies DeckExtendedDto;
        });

        return items;
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
            .addSelect(
                "COUNT(CASE WHEN progress.repetitions IS NOT NULL THEN progress.id END)",
                "learned_count",
            )
            .leftJoin(CardEntity, "card", "card.deckId = user_deck.deckId")
            .leftJoin(
                "user_card_progress",
                "progress",
                "progress.cardId = card.id AND progress.userId = :userId",
            )
            .where("user_deck.userId = :userId")
            .setParameters({ userId, now: new Date() });

        const result = await query.getRawOne();

        const cardsToLearnCount = result.total_count - result.learned_count;
        return {
            cardsToLearnCount,
            cardsTotal: result.total_count,
            cardsToReviewCount: result.review_count,
            decksToPracticeCount: result.decks_practice_count,
            cardsToPracticeCount: cardsToLearnCount + result.review_count,
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

    /**
     * Calculates the difference between the current and previous practice session results for each deck in the 'deckIds' array
     * This method is used when the user finishes a practice session and wants to see the results
     */
    private async getPracticeResults(
        params: FinalizePracticeDto,
    ): Promise<PracticeSessionResultDto[]> {
        const { deckIds, userId } = params;

        // get current practice session results
        const query = this.userDecksRepository
            .createQueryBuilder("user_deck")
            .select("user_deck.deckId", "deck_id")
            .addSelect("COUNT(card.id)", "total_cards_count")
            .addSelect(
                "COUNT(CASE WHEN progress.lastGrade = 2 AND progress.streakCount >= 5 THEN 1 END)",
                "learned_cards_count",
            )
            .addSelect(
                "COUNT(CASE WHEN progress.lastGrade = 0 THEN 1 END)",
                "difficult_cards_count",
            )
            .addSelect("AVG(progress.lastGrade)", "average_grade")
            .addSelect("AVG(progress.easinessFactor)", "average_easiness_factor")
            .addSelect("AVG(progress.interval)", "average_interval")
            .leftJoin(CardEntity, "card", "card.deckId = user_deck.deckId")
            .leftJoin(
                "user_card_progress",
                "progress",
                "progress.cardId = card.id AND progress.userId = :userId",
            )
            .where("user_deck.userId = :userId")
            .andWhere("user_deck.deckId IN (:...deckIds)")
            .groupBy("user_deck.deckId")
            .setParameters({ userId, deckIds });

        const currentStatsRaw = await query.getRawMany();

        const currentStats = currentStatsRaw.map((item) => {
            return {
                totalCardsCount: item.total_cards_count,
                learnedCardsCount: item.learned_cards_count,
                difficultCardsCount: item.difficult_cards_count,
                averageGrade: +item.average_grade,
                averageEasinessFactor: +item.average_easiness_factor,
                averageInterval: +item.average_interval,
                deckId: item.deck_id,
                userId: params.userId,
                deck: { id: item.deck_id },
                user: { id: params.userId },
            } satisfies DeepPartial<DeckPracticeSessionEntity>;
        });

        // get previous practice session results
        const previousStatsInnerQuery = this.deckPracticeSessionRepository
            .createQueryBuilder()
            .subQuery()
            .select("MAX(inner_session.id)")
            .from("deck_practice_session", "inner_session")
            .where("inner_session.userId = :userId", { userId: params.userId })
            .andWhere("inner_session.deckId IN (:...deckIds)", {
                deckIds: params.deckIds,
            })
            .groupBy("inner_session.deckId")
            .getQuery();

        const previousStats = await this.deckPracticeSessionRepository
            .createQueryBuilder("session")
            .select([
                "session.deckId",
                "session.totalCardsCount",
                "session.learnedCardsCount",
                "session.difficultCardsCount",
                "session.averageGrade",
                "session.averageEasinessFactor",
                "session.averageInterval",
            ])
            .where("session.userId = :userId", { userId: params.userId })
            .andWhere("session.deckId IN (:...deckIds)", { deckIds: params.deckIds })
            .andWhere(`session.id IN (${previousStatsInnerQuery})`)
            .setParameters({ userId: params.userId, deckIds: params.deckIds })
            .getMany();

        const results = currentStats.map((current) => {
            const previous = previousStats.find((prev) => prev.deckId === current.deckId) || {
                totalCardsCount: current.totalCardsCount,
                learnedCardsCount: 0,
                difficultCardsCount: 0,
                averageGrade: 0,
                averageEasinessFactor: 1.3,
                averageInterval: 0,
            };

            const learnedCardsCount = current.learnedCardsCount - previous.learnedCardsCount;
            const difficultCardsCount = current.difficultCardsCount - previous.difficultCardsCount;
            const averageGrade = current.averageGrade - previous.averageGrade;
            const averageEasinessFactor =
                current.averageEasinessFactor - previous.averageEasinessFactor;
            const averageInterval = current.averageInterval - previous.averageInterval;

            return {
                deckId: current.deckId,
                current,
                improvement: {
                    learnedCardsCount,
                    learnedCardsPercent:
                        previous.learnedCardsCount > 0
                            ? learnedCardsCount / previous.learnedCardsCount
                            : 0,
                    difficultCardsCount,
                    difficultCardsPercent:
                        previous.difficultCardsCount > 0
                            ? difficultCardsCount / previous.difficultCardsCount
                            : 0,
                    averageGrade,
                    averageGradePercent:
                        previous.averageGrade > 0 ? averageGrade / previous.averageGrade : 0,
                    averageEasinessFactor,
                    averageInterval,
                } satisfies PracticeSessionResultDto["improvement"],
            };
        });

        return results;
    }
}
