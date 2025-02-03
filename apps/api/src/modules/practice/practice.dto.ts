import { IsNumber, Max, Min } from "class-validator";
import { MAX_RATE_CARD_GRADE } from "../../common/constants/practice.constants";

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
