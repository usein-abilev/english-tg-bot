import { Context, SessionFlavor } from "grammy";
import type { ConversationFlavor } from "@grammyjs/conversations";
import UserCardEntity from "../api/db/entities/userCard.entity";
import { HydrateFlavor } from "@grammyjs/hydrate";
import WordMeaningEntity from "../api/db/entities/meaning.entity";

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
        current?: WordMeaningEntity;
        previous?: WordMeaningEntity;
        examples?: string[];
        distractions?: { correct: boolean; text: string }[];
        loadedCount: number;
        words: WordMeaningEntity[];
    };
}

export type BotContext = HydrateFlavor<
    Context & SessionFlavor<BotSessionData> & ConversationFlavor
>;
