import { HydrateFlavor } from "@grammyjs/hydrate";
import { Context, SessionFlavor } from "grammy";

interface BotSessionUser {
    /**
     * The user id stored in the database.
     */
    id: number;

    /**
     * Language code of the user.
     */
    languageCode: string;
}

export interface BotSessionData {
    user?: BotSessionUser;
}

export type BotContext = HydrateFlavor<Context & SessionFlavor<BotSessionData>>;
