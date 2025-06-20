import { Injectable } from "@nestjs/common";
import appConfig from "../../configs/app.config";
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

@Injectable()
export class DictionaryTranslateService {
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

    private async fetch<TSuccess, TError = TranslateDefaultErrorObject>(
        path: APIPath,
        params: Record<string, unknown> = {},
    ): Promise<TranslateServiceResponse<TSuccess, TError>> {
        const url = new URL(
            `http://${appConfig.translation.host}:${appConfig.translation.port}/${path}`,
        );

        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(params),
            headers: { "Content-Type": "application/json" },
        })
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
                return res.json();
            })
            .catch((error) => {
                return {
                    ok: false,
                    error: {
                        status: error.status || 500,
                        message: error.message || "Unknown error",
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
