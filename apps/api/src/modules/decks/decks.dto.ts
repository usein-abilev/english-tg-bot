import { IsString } from "class-validator";

/**
 * CreateDeckDto - Data transfer object for creating a deck
 */
export class CreateDeckQueryDto {
    @IsString()
    title: string;

    @IsString()
    description: string;
}

export class CreateDeckDto extends CreateDeckQueryDto {
    userId: number;
}
