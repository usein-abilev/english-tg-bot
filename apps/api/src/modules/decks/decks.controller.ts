import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    Request,
    UseGuards,
    ValidationPipe,
} from "@nestjs/common";
import { DecksService } from "./decks.service";
import {
    AddCardQueryDto,
    CreateDeckQueryDto,
    GetCardsQueryDto,
    UpdateDeckQueryDto,
} from "./decks.dto";
import { ClientRequest } from "../../common/types/request.types";
import { TgInitDataGuard } from "../../common/guards/tg.guard";

@Controller("decks")
@UseGuards(TgInitDataGuard)
export class DecksController {
    constructor(private readonly decksService: DecksService) {}

    @Get("/:id")
    async getById(@Request() request: ClientRequest, @Param("id", ParseIntPipe) id: number) {
        return this.decksService.get(id, request.initData.user.id);
    }

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

    @Put("/:id")
    async updateDeck(
        @Request() request: ClientRequest,
        @Param("id", ParseIntPipe) deckId: number,
        @Body() body: UpdateDeckQueryDto,
    ) {
        return this.decksService.updateDeck(deckId, {
            ...body,
            userId: request.initData.user.id,
        });
    }

    @Delete("/:id")
    async deleteDeck(@Request() request: ClientRequest, @Param("id", ParseIntPipe) deckId: number) {
        return this.decksService.deleteDeck(deckId, request.initData.user.id);
    }

    @Post("/:id/favorite")
    async addFavoriteDeck(
        @Request() request: ClientRequest,
        @Param("id", ParseIntPipe) id: number,
    ) {
        return this.decksService.addFavoriteDeck(id, request.initData.user.id);
    }

    @Get("/:id/cards")
    async getCards(
        @Request() request: ClientRequest,
        @Param("id", ParseIntPipe) id: number,
        @Query() query: GetCardsQueryDto,
    ) {
        return this.decksService.getCards(id, query);
    }

    @Post("/:id/cards")
    async createCard(
        @Request() request: ClientRequest,
        @Param("id", ParseIntPipe) id: number,
        @Body() body: AddCardQueryDto,
    ) {
        return this.decksService.addCard(id, {
            ...body,
            userId: request.initData.user.id,
        });
    }

    @Delete("/:id/cards/:cardId")
    async deleteCard(
        @Request() request: ClientRequest,
        @Param("id", ParseIntPipe) id: number,
        @Param("cardId", ParseIntPipe) cardId: number,
    ) {
        return this.decksService.deleteCard(id, cardId, request.initData.user.id);
    }
}
