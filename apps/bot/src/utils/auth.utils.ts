import { subtle } from "crypto";
import botConfig from "../config";
import { User } from "grammy/types";

type AuthData = Record<string, string | number>;

export const generateAuthHeaderFromUser = async (user: User): Promise<string> => {
    const searchParams = await generateAuthSearchParams({
        user: JSON.stringify({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username,
            language_code: user.language_code,
            is_premium: user.is_premium,
        }),
        from_bot: 1,
        auth_date: Date.now(),
    });
    return searchParams.toString();
};

const generateAuthSearchParams = async (data: AuthData): Promise<URLSearchParams> => {
    const hash = await generateTelegramHash(data);
    const urlParams = new URLSearchParams(data as unknown as Record<string, string>);
    urlParams.set("hash", hash);
    return urlParams;
};

const generateTelegramHash = async (data: AuthData): Promise<string> => {
    const botToken = botConfig.botToken;
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
