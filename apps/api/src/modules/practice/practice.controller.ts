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
    FinalizePracticeQueryDto,
    GetPracticeStatsQueryDto,
    PracticeGetCardsQueryDto,
    PracticeGetDecksQueryDto,
} from "./practice.dto";

@Controller("practice")
@UseGuards(TgInitDataGuard)
export class PracticeController {
    constructor(private readonly practiceService: PracticeService) {}

    @Get("/stats")
    async getPracticeStats(
        @Request() request: ClientRequest,
        @Query() query: GetPracticeStatsQueryDto,
    ) {
        const userId = request.initData.user.id;
        return this.practiceService.getPracticeStats({ ...query, userId });
    }

    @Post("/finalize")
    async finalizePractice(
        @Request() request: ClientRequest,
        @Body() body: FinalizePracticeQueryDto,
    ) {
        const userId = request.initData.user.id;
        return this.practiceService.finalizePractice({ ...body, userId });
    }

    @Get("/decks")
    async getDecksToPractice(
        @Request() request: ClientRequest,
        @Query() query: PracticeGetDecksQueryDto,
    ) {
        const userId = request.initData.user.id;
        return this.practiceService.getDecksToPractice(userId, query);
    }

    @Get("/cards")
    async getCardsToPractice(
        @Request() request: ClientRequest,
        @Query() query: PracticeGetCardsQueryDto,
    ) {
        const userId = request.initData.user.id;
        return this.practiceService.getCardsToPractice(userId, query);
    }

    @Post("/rateCards")
    async rateCards(
        @Request() request: ClientRequest,
        @Body(new ValidationPipe({ transform: true })) body: BatchRateCardQueryDto,
    ) {
        const userId = request.initData.user.id;
        return this.practiceService.rateCards({ ...body, userId });
    }
}
