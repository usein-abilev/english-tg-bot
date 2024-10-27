export interface DictionaryResponseItem {
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

interface DictionaryErrorObject {
    title: string;
    message: string;
    resolution: string;
}

const DICTIONARY_API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";

interface DictionarySuccessResponse {
    ok: true;
    data: DictionaryResponseItem[];
}

interface DictionaryErrorResponse {
    ok: false;
    error: DictionaryErrorObject;
}

type DictionaryResponse = DictionarySuccessResponse | DictionaryErrorResponse;

export default class DictionaryService {
    constructor() {}

    public async reveal(word: string): Promise<DictionaryResponse> {
        word = word.trim();

        if (!word) {
            return {
                ok: false,
                error: {
                    title: "Word is required.",
                    message: "Word is required.",
                    resolution: "Please provide a word to reveal.",
                },
            };
        }

        const response = await fetch(DICTIONARY_API_URL + word)
            .then((res) => res.json())
            .catch((error) => {
                return {
                    ok: false,
                    error: {
                        title: "Error fetching data.",
                        message: error.message,
                        resolution: "Please try again later.",
                    },
                };
            });

        if (Array.isArray(response)) {
            return {
                ok: true,
                data: response as DictionaryResponseItem[],
            };
        }

        return {
            ok: false,
            error: response,
        };
    }
}
