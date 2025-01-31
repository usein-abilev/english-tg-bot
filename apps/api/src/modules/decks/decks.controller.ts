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
import { DecksService } from "./decks.service";
import { AddCardQueryDto, CreateDeckQueryDto, GetCardsQueryDto } from "./decks.dto";
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
        return this.decksService.createDeck({
            ...body,
            userId: request.initData.user.id,
        });
    }

    @Get("/:id/cards")
    async getCards(@Request() request: ClientRequest, @Query() query: GetCardsQueryDto) {
        return this.decksService.getCards(+request.params.id, query);
    }

    @Post("/:id/cards")
    async createCard(@Request() request: ClientRequest, @Body() body: AddCardQueryDto) {
        return this.decksService.addCard(+request.params.id, body);
    }
}
