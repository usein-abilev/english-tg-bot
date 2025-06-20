import { Controller, Get, Query, Request, UseGuards } from "@nestjs/common";
import { TgInitDataGuard } from "../../common/guards/tg.guard";
import { DictionaryService } from "./dictionary.service";
import { ClientRequest } from "../../common/types/request.types";
import { DictionaryFindSuggestionsDto, DictionaryFindDefinitionsDto } from "./dictionary.dto";

@Controller("dictionary")
@UseGuards(TgInitDataGuard)
export class DictionaryController {
    constructor(private readonly dictionaryService: DictionaryService) {}

    @Get("/suggestions")
    async findSuggestions(
        @Request() request: ClientRequest,
        @Query() params: DictionaryFindSuggestionsDto,
    ) {
        return this.dictionaryService.findSuggestions(params);
    }

    @Get("/definitions")
    async findDefinitions(
        @Request() request: ClientRequest,
        @Query() params: DictionaryFindDefinitionsDto,
    ) {
        return this.dictionaryService.findDefinitions(params);
    }
}
