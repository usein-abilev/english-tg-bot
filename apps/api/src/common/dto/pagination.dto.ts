import { IsStringNumber } from "../decorators/validate.decorators";

export class PaginationQueryDto {
    @IsStringNumber()
    page: number;

    @IsStringNumber()
    limit: number;
}
