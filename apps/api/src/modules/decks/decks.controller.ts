import { Body, Controller, Post, Put, Request, UseGuards, ValidationPipe } from "@nestjs/common";
import { DecksService } from "./decks.service";
import { CreateDeckQueryDto } from "./decks.dto";
import { ClientRequest } from "../../common/types/request.types";
import { TgInitDataGuard } from "../../common/guards/tg.guard";

@Controller("decks")
@UseGuards(TgInitDataGuard)
export class DecksController {
    constructor(private readonly decksService: DecksService) {}

    @Post("/")
    async createDeck(
        @Request() request: ClientRequest,
        @Body(new ValidationPipe({ transform: true })) body: CreateDeckQueryDto,
    ) {
        return this.decksService.create({
            ...body,
            userId: request.initData.user.id,
        });
    }

    @Put("/:id")
    async updateDeck() {}
}
