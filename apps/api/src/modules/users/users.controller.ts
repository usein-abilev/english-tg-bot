import { Controller, Get, Logger, Request, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { TgInitDataGuard } from "../../common/guards/tg.guard";
import { TgInitData } from "../../common/types/tgInitData.types";
import { DecksService } from "../decks/decks.service";

@Controller("users")
export class UsersController {
    private readonly logger = new Logger(UsersController.name);

    constructor(
        private readonly usersService: UsersService,
        private readonly decksService: DecksService,
    ) {}

    @Get("/me")
    @UseGuards(TgInitDataGuard)
    async getUser(@Request() request) {
        const { user: telegramUser } = request.initData as TgInitData;
        const user = await this.usersService.getOrCreateFromApp(telegramUser);
        const userDecks = await this.decksService.getUserDecks(user.id);
        this.logger.debug(`User ${user.id} requested his data`, user);
        return { user, decks: userDecks };
    }
}
