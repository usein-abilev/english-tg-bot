import { IsNumber, Max, Min } from "class-validator";
import { MAX_RATE_CARD_GRADE } from "../../common/constants/practice.constants";
import { Transform } from "class-transformer";
import { DeckEntity } from "../../common/entities/deck.entity";

export class PracticeRateCardQueryDto {
    @IsNumber()
    cardId: number;

    @Min(1)
    @Max(MAX_RATE_CARD_GRADE)
    @IsNumber()
    grade: number;
}

export interface PracticeRateCardDto extends PracticeRateCardQueryDto {
    userId: number;
}

export class PracticeGetDecksQueryDto {
    @Max(50)
    @Transform(({ value }) => Number(value))
    @IsNumber()
    limit: number;
}

export interface PracticeDecksResponse extends DeckEntity {
    id: number;
    title: string;
    description: string;
    authorId: number;
    createdAt: Date;
    lastReviewAt?: Date;
    nextReviewAt: Date;

    stats: {
        cardsCount: number;
        newCardsCount: number;
        dueCardsCount: number;
    };
}
