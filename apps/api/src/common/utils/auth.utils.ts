import { subtle } from "crypto";
import { TextEncoder } from "util";
import appConfig from "../../configs/app.config";
import { TgInitData } from "../types/tgInitData.types";

export interface ValidateTelegramInitDataResult {
    valid: boolean;
    data: TgInitData;
}

export const validateTelegramInitData = async (
    rawInitData: string,
): Promise<ValidateTelegramInitDataResult> => {
    if (!rawInitData) return { valid: false, data: null };
    const urlParams = new URLSearchParams(rawInitData);
    try {
        const { hash: originalHash, ...entries } = Object.fromEntries(urlParams);
        const hash = await generateTelegramHash(entries);
        const data = parseTelegramInitData(entries);
        return {
            valid: originalHash === hash,
            data,
        };
    } catch (_) {
        return {
            valid: false,
            data: null,
        };
    }
};

export const generateTelegramHash = async (data: Record<string, string>): Promise<string> => {
    const botToken = appConfig.telegram.token;
    const encoder = new TextEncoder();

    const normalized = Object.keys(data)
        .map((key) => `${key}=${data[key]}`)
        .sort()
        .join("\n");

    const secretKey = await subtle.importKey(
        "raw",
        encoder.encode("WebAppData"),
        { name: "HMAC", hash: "SHA-256" },
        true,
        ["sign"],
    );
    const secret = await subtle.sign("HMAC", secretKey, encoder.encode(botToken));
    const signatureKey = await subtle.importKey(
        "raw",
        secret,
        { name: "HMAC", hash: "SHA-256" },
        true,
        ["sign"],
    );
    const signature = await subtle.sign("HMAC", signatureKey, encoder.encode(normalized));
    return [...new Uint8Array(signature)].map((b) => b.toString(16).padStart(2, "0")).join("");
};

const parseTelegramInitData = (data: Record<string, string>): TgInitData => {
    const parsedUser = JSON.parse(data.user);
    return {
        user: {
            id: +parsedUser.id,
            firstName: parsedUser.first_name,
            lastName: parsedUser.last_name,
            username: parsedUser.username,
            languageCode: parsedUser.language_code || "en",
            isPremium: parsedUser.is_premium || false,
            allowsWriteToPm: parsedUser.allows_write_to_pm || false,
            photoUrl: parsedUser.photo_url || "",
        },
        authDate: data.auth_date,
        chatInstance: data.chat_instance,
        fromBot: data.from_bot === "1",
    };
};
