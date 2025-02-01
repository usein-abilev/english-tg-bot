import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

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

export class CreateDeckDto extends CreateDeckQueryDto {
    userId: number;
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

export class GetCardsQueryDto {
    @IsNumber()
    @Transform(({ value }) => Number(value))
    page: number;

    @IsNumber()
    @Transform(({ value }) => Number(value))
    limit: number;
}
