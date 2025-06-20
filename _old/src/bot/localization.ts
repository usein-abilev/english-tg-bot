import i18next from "i18next";
import fs from "fs/promises";
import { logger } from "../utils/logger.util";
import { BotContext } from "./session";

export default async function initLocalization() {
    await i18next.init({
        lng: "en",
        resources: {},
    });
    const files = await fs.readdir("locales");
    for (const file of files) {
        const lang = file.replace(".json", "");
        const content = await fs.readFile(`locales/${file}`, "utf-8");
        i18next.addResourceBundle(lang, "translation", JSON.parse(content));
    }
    logger.info("Localization initialized", files);
}

export const localizeText = (ctx: BotContext, key: string, params?: Record<string, unknown>) => {
    return i18next.t(key, {
        lng: ctx.session.user.languageCode,
        fallbackLng: "en",
        ...params,
    });
};
