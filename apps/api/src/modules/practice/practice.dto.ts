import {
    ArrayMaxSize,
    ArrayMinSize,
    IsArray,
    IsIn,
    IsNumber,
    IsOptional,
    IsString,
    Max,
    Min,
    ValidateNested,
} from "class-validator";
import { MAX_RATE_CARD_GRADE } from "../../common/constants/practice.constants";
import { Transform, Type } from "class-transformer";
import { PaginationQueryDto } from "../../common/dto/pagination.dto";
import { DeckPracticeSessionEntity } from "../../common/entities/deckPracticeSession.entity";
import { DeepPartial } from "typeorm";

export class PracticeRateCardQueryDto {
    @IsNumber()
    cardId: number;

    @Min(0)
    @Max(MAX_RATE_CARD_GRADE - 1)
    @IsNumber()
    grade: number;
}

export class BatchRateCardQueryDto {
    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @ArrayMaxSize(100)
    @Type(() => PracticeRateCardQueryDto)
    cards: PracticeRateCardQueryDto[];
}

export interface BatchRateCardDto extends BatchRateCardQueryDto {
    userId: number;
}

export class PracticeGetDecksQueryDto {
    @Max(50)
    @Transform(({ value }) => Number(value))
    @IsNumber()
    limit?: number;
}

export class PracticeGetCardsQueryDto extends PaginationQueryDto {
    @Min(1)
    @Transform(({ value }) => Number(value))
    @IsNumber()
    @IsOptional()
    deckId?: number;
}

export class GetPracticeStatsQueryDto {
    @IsArray()
    @IsOptional()
    @ArrayMinSize(1)
    @ArrayMaxSize(100)
    @IsNumber({}, { each: true })
    deckIds?: number[];

    @IsString()
    @IsIn(["daily", "weekly"])
    range: "daily" | "weekly";
}

export class GetPracticeStatsDto extends GetPracticeStatsQueryDto {
    userId: number;
}

export class FinalizePracticeQueryDto {
    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(100)
    @IsNumber({}, { each: true })
    deckIds: number[];
}

export class FinalizePracticeDto extends FinalizePracticeQueryDto {
    userId: number;
}

export interface PracticeSessionResult {
    deckId: number;
    current: DeepPartial<DeckPracticeSessionEntity>;
    improvement: DeepPartial<DeckPracticeSessionEntity> & {
        learnedCardsPercent: number;
        averageGradePercent: number;
        difficultCardsPercent: number;
    };
}
