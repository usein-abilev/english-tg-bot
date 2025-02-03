import { Body, Controller, Get, Post, Request, UseGuards, ValidationPipe } from "@nestjs/common";
import { PracticeService } from "./practice.service";
import { TgInitDataGuard } from "../../common/guards/tg.guard";
import { ClientRequest } from "../../common/types/request.types";
import { PracticeRateCardQueryDto } from "./practice.dto";

@Controller("practice")
@UseGuards(TgInitDataGuard)
export class PracticeController {
    constructor(private readonly practiceService: PracticeService) {}

    @Get("/decks")
    async getDecksToPractice(@Request() request: ClientRequest) {
        const userId = request.initData.user.id;
        return this.practiceService.getDecksToPractice(userId);
    }

    @Post("/rateCard")
    async rateCard(
        @Request() request: ClientRequest,
        @Body(new ValidationPipe({ transform: true })) body: PracticeRateCardQueryDto,
    ) {
        const userId = request.initData.user.id;
        return this.practiceService.rateCard({ ...body, userId });
    }
}
