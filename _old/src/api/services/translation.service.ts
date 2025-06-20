import appConfig from "../../appConfig";
import Debug from "../decorators/debug.decorator";

type TranslateLanguageCode = "en" | "ru";

export interface TranslateOptions {
    source: TranslateLanguageCode | "auto";
    target: TranslateLanguageCode;
    format: "text";
    alternatives?: number;
}

type TranslateResultData = {
    translatedText: string;
    alternatives: string[];
    detectedLanguage: { confidence: number; language: TranslateLanguageCode };
};

type DetectResultData = {
    confidence: number;
    language: TranslateLanguageCode;
}[];

type APIPath = "translate" | "detect";

interface TranslateDefaultErrorObject {
    status: number;
    message: string;
}

interface TranslateServiceSuccess<T> {
    ok: true;
    data: T;
}
interface TranslateServiceError<T> {
    ok: false;
    error: T;
}
type TranslateServiceResponse<TSuccess, TError = TranslateDefaultErrorObject> =
    | TranslateServiceSuccess<TSuccess>
    | TranslateServiceError<TError>;

const BATCH_DELIMITER = "\n";

export default class TranslationService {
    constructor() {}

    @Debug({ name: "TranslationService.detect" })
    public async detect(text: string): Promise<TranslateServiceResponse<DetectResultData>> {
        return this.fetch("detect", { q: text });
    }

    @Debug({ name: "TranslationService.translate" })
    public async translate(
        text: string,
        options: TranslateOptions = {
            source: "auto",
            target: "en",
            format: "text",
            alternatives: 3,
        },
    ): Promise<TranslateServiceResponse<TranslateResultData>> {
        return this.fetch("translate", {
            q: text,
            ...options,
        });
    }

    public async translateBatch(
        texts: string[],
        options: TranslateOptions = {
            source: "auto",
            target: "en",
            format: "text",
            alternatives: 0,
        },
    ): Promise<TranslateServiceResponse<TranslateResultData[]>> {
        const query = texts.join(BATCH_DELIMITER);
        const response = await this.fetch<TranslateResultData>("translate", {
            q: query,
            ...options,
        });

        if (response.ok) {
            const translations = response.data.translatedText.split(BATCH_DELIMITER);
            return {
                ok: true,
                data: translations.map((word) => {
                    return {
                        translatedText: word.trim(),
                        alternatives: [],
                        detectedLanguage: response.data.detectedLanguage,
                    };
                }),
            };
        }

        return response;
    }

    private async fetch<TSuccess, TError = TranslateDefaultErrorObject>(
        path: APIPath,
        params: Record<string, unknown> = {},
    ): Promise<TranslateServiceResponse<TSuccess, TError>> {
        const url = `http://${appConfig.translation.host}:${appConfig.translation.port}/${path}`;
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(params),
            headers: { "Content-Type": "application/json" },
        })
            .then((res) => res.json())
            .catch((error) => {
                return {
                    ok: false,
                    error: {
                        status: error.status || 500,
                        message: error.message || error.error,
                    },
                };
            });

        if (response.error) return response;

        return {
            ok: true,
            data: response,
        };
    }
}
