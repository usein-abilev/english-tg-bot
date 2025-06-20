import { BadRequestException, Inject, Injectable, Logger } from "@nestjs/common";
import {
    DictionaryFindSuggestionsDto,
    DictionaryResponseItemDto,
    DictionaryFindDefinitionsDto,
} from "./dictionary.dto";
import appConfig from "../../configs/app.config";
import { DictionaryTranslateService } from "./dictionaryTranslate.service";

@Injectable()
export class DictionaryService {
    private readonly logger = new Logger(DictionaryService.name);

    constructor(
        @Inject(DictionaryTranslateService)
        private readonly translateService: DictionaryTranslateService,
    ) {}

    async findSuggestions(params: DictionaryFindSuggestionsDto): Promise<string[]> {
        const url = new URL(`https://api.datamuse.com/sug`);
        url.searchParams.append("s", params.term);
        url.searchParams.append("max", String(params.limit || 3));

        const response = await fetch(url)
            .then((res) => res.json())
            .catch((error) => {
                this.logger.warn("Failed to fetch suggestions:", error);
                return [];
            });

        return response.map((item: { word: string }) => item.word);
    }

    async findDefinitions(params: DictionaryFindDefinitionsDto) {
        const word = params.term.trim();
        if (!word) {
            throw new BadRequestException("Word is required");
        }

        const definitions = await this.fetchTermDefinition(word);

        const translateResult = await this.translateService.translate(word, {
            source: "auto",
            target: params.targetLanguage as "en" | "ru",
            alternatives: params.limit ?? 3,
            format: "text",
        });

        return {
            definitions,
            translation: translateResult.ok ? translateResult.data : null,
        };
    }

    private async fetchTermDefinition(term: string): Promise<DictionaryResponseItemDto[]> {
        const url = `${appConfig.dictionary.url}/entries/en/${term}`;
        const response = await fetch(url)
            .then((res) => res.json())
            .catch((error) => {
                this.logger.error(error);
                return null;
            });

        if (Array.isArray(response)) {
            return response as DictionaryResponseItemDto[];
        }
        return [];
    }
}
