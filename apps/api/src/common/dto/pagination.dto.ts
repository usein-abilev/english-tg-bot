import { Transform } from "class-transformer";
import { IsNumber } from "class-validator";

export class PaginationQueryDto {
    @IsNumber()
    @Transform(({ value }) => Number(value))
    page: number;

    @IsNumber()
    @Transform(({ value }) => Number(value))
    limit: number;
}
