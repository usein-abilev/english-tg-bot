import { Controller, Get, Query, Request, UseGuards } from "@nestjs/common";
import { TgInitDataGuard } from "../../common/guards/tg.guard";
import { DictionaryService } from "./dictionary.service";
import { ClientRequest } from "../../common/types/request.types";
import { DictionaryRevealDto } from "./dictionary.dto";

@Controller("dictionary")
@UseGuards(TgInitDataGuard)
export class DictionaryController {
    constructor(private readonly dictionaryService: DictionaryService) {}

    @Get("/reveal")
    async reveal(@Request() request: ClientRequest, @Query() params: DictionaryRevealDto) {
        return this.dictionaryService.reveal(params.term);
    }
}
