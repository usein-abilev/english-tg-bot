import { IsString } from "class-validator";

export class DictionaryRevealDto {
    @IsString()
    term: string;
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
