import {
    ArrayMaxSize,
    ArrayMinSize,
    IsArray,
    IsNumber,
    Max,
    Min,
    ValidateNested,
} from "class-validator";
import { MAX_RATE_CARD_GRADE } from "../../common/constants/practice.constants";
import { Transform, Type } from "class-transformer";

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
    limit: number;
}
