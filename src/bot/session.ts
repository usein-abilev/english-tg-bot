import { Context, SessionFlavor } from "grammy";
import type { ConversationFlavor } from "@grammyjs/conversations";
import UserCardEntity from "../api/db/entities/card.entity";

export interface BotSessionData {
    user: {
        /**
         * The user id stored in the database.
         */
        id: number;
    };
    practice?: {
        cards: UserCardEntity[];
        current?: UserCardEntity;
    };
}

export type BotContext = Context & SessionFlavor<BotSessionData> & ConversationFlavor;
