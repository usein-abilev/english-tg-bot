import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { DeckEntity } from "../../common/entities/deck.entity";
import { PaginationQueryDto } from "../../common/dto/pagination.dto";

/**
 * Data transfer object for a deck.
 * Combined DeckEntity and UserDeckEntity for the sake of simplicity on the client side.
 */
export interface DeckExtendedDto extends DeckEntity {
    cardsCount?: number;
    progress?: {
        lastReviewAt?: Date;
        nextReviewAt?: Date;
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

    @IsBoolean()
    @IsOptional()
    public?: boolean;
}

export class FindDecksQueryDto extends PaginationQueryDto {}

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

export class UpdateCardQueryDto {
    @IsString()
    @IsOptional()
    term?: string;

    @IsString()
    @IsOptional()
    definition?: string;

    @IsString()
    @IsOptional()
    description?: string;
}

export class UpdateCardDto extends UpdateCardQueryDto {
    userId: number;
    deckId: number;
}

export class GetCardsQueryDto extends PaginationQueryDto {}
