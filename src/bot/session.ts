import { Context, SessionFlavor } from "grammy";
import type { ConversationFlavor } from "@grammyjs/conversations";
import UserCardEntity from "../api/db/entities/userCard.entity";
import WordEntity from "../api/db/entities/word.entity";
import { HydrateFlavor } from "@grammyjs/hydrate";

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
    discovery?: {
        current?: WordEntity;
        distractions?: { correct: boolean; text: string }[];
        loadedCount: number;
        words: WordEntity[];
    };
}

export type BotContext = HydrateFlavor<
    Context & SessionFlavor<BotSessionData> & ConversationFlavor
>;
