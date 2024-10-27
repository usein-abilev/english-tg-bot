import { Context, SessionFlavor } from "grammy";
import type { ConversationFlavor } from "@grammyjs/conversations";
import UserCardEntity from "../api/db/entities/card.entity";

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
    user: BotSessionUser;
    practice?: {
        cards: UserCardEntity[];
        total: number;
        loadedCount: number;
        current?: UserCardEntity;
    };
}

export type BotContext = Context & SessionFlavor<BotSessionData> & ConversationFlavor;
