import { Controller, Get, Logger, Request, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { TgInitDataGuard } from "../../common/guards/tg.guard";
import { TgInitData } from "../../common/types/tgInitData.types";
import { DecksService } from "../decks/decks.service";
import { PracticeService } from "../practice/practice.service";
import { ClientRequest } from "src/common/types/request.types";

@Controller("users")
export class UsersController {
    private readonly logger = new Logger(UsersController.name);

    constructor(
        private readonly usersService: UsersService,
        private readonly decksService: DecksService,
        private readonly practiceService: PracticeService,
    ) {}

    @Get("/me")
    @UseGuards(TgInitDataGuard)
    async getUser(@Request() request: ClientRequest) {
        const { user: telegramUser, fromBot } = request.initData as TgInitData;
        const user = await this.usersService.getOrCreate(telegramUser, !fromBot);
        if (fromBot) {
            return { user };
        }

        const userDecks = await this.practiceService.getDecksToPractice(user.id);
        const practiceCounters = await this.practiceService.getUserPracticeCounters(user.id);
        this.logger.debug(`User ${user.id} requested his data`, user);
        return { user, decks: userDecks, practiceCounters };
    }
}
