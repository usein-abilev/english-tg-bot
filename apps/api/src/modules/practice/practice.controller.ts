import {
    Body,
    Controller,
    Get,
    Post,
    Query,
    Request,
    UseGuards,
    ValidationPipe,
} from "@nestjs/common";
import { PracticeService } from "./practice.service";
import { TgInitDataGuard } from "../../common/guards/tg.guard";
import { ClientRequest } from "../../common/types/request.types";
import {
    BatchRateCardQueryDto,
    PracticeGetDecksQueryDto,
    PracticeRateCardQueryDto,
} from "./practice.dto";

@Controller("practice")
@UseGuards(TgInitDataGuard)
export class PracticeController {
    constructor(private readonly practiceService: PracticeService) {}

    @Get("/decks")
    async getDecksToPractice(
        @Request() request: ClientRequest,
        @Query() query: PracticeGetDecksQueryDto,
    ) {
        const userId = request.initData.user.id;
        return this.practiceService.getDecksToPractice(userId, query);
    }

    @Post("/rateCard")
    async rateCard(
        @Request() request: ClientRequest,
        @Body(new ValidationPipe({ transform: true })) body: PracticeRateCardQueryDto,
    ) {
        const userId = request.initData.user.id;
        return this.practiceService.rateCard({ ...body, userId });
    }

    @Post("/rateCardBatch")
    async rateCardBatch(
        @Request() request: ClientRequest,
        @Body(new ValidationPipe({ transform: true })) body: BatchRateCardQueryDto,
    ) {
        const userId = request.initData.user.id;
        return this.practiceService.rateCardBatch({ ...body, userId });
    }
}
