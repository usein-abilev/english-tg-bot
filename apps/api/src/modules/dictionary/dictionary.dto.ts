import { IsIn, IsString, Max } from "class-validator";
import { IsStringNumber } from "../../common/decorators/validate.decorators";

export class DictionaryFindSuggestionsDto {
    @IsString()
    term: string;

    @IsStringNumber()
    @Max(5)
    limit: number;
}

export class DictionaryFindDefinitionsDto {
    @IsString()
    term: string;

    @IsStringNumber()
    @Max(5)
    limit: number;

    @IsString()
    @IsIn(["ru", "en"])
    targetLanguage: string;
}

export interface DictionaryResponseItemDto {
    word: string;
    phonetic?: string;
    phonetics?: {
        text?: string;
        audio: string;
        sourceUrl: string;
        license: {
            name: string;
            url: string;
        };
    }[];
    meanings: {
        partOfSpeech: string;
        definitions: {
            definition: string;
            synonyms: string[];
            antonyms: string[];
            example?: string;
        }[];
        synonyms: string[];
        antonyms: string[];
    }[];
    license: {
        name: string;
        url: string;
    };
    sourceUrls: string[];
}
