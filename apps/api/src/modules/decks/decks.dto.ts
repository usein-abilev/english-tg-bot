import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { DeckEntity } from "../../common/entities/deck.entity";

/**
 * Data transfer object for a deck.
 * Combined DeckEntity and UserDeckEntity for the sake of simplicity on the client side.
 */
export interface DeckExtendedDto extends DeckEntity {
    progress?: {
        lastReviewAt?: Date;
        nextReviewAt?: Date;
        cardsCount: number;
        cardsToLearnCount: number;
        cardsToReviewCount: number;
    };
}

/**
 * CreateDeckDto - Data transfer object for creating a deck
 */
export class CreateDeckQueryDto {
    @IsString()
    @MinLength(3)
    title: string;

    @IsString()
    @MaxLength(128)
    description: string;
}

/**
 * UpdateDeckQuery - Data transfer object for editing deck
 */
export class UpdateDeckQueryDto {
    @IsString()
    @MinLength(3)
    title: string;

    @IsString()
    @MaxLength(128)
    description: string;
}

export class UpdateDeckDto extends UpdateDeckQueryDto {
    userId: number;
}

export class CreateDeckDto extends CreateDeckQueryDto {
    userId: number;
    cards?: AddCardQueryDto[];
}

export class AddCardQueryDto {
    @IsString()
    term: string;

    @IsString()
    definition: string;

    @IsString()
    @IsOptional()
    description: string;
}

export class AddCardDto extends AddCardQueryDto {
    userId: number;
}

export class GetCardsQueryDto {
    @IsNumber()
    @Transform(({ value }) => Number(value))
    page: number;

    @IsNumber()
    @Transform(({ value }) => Number(value))
    limit: number;
}
