import { ConversationFn } from "@grammyjs/conversations";
import enterNewWord from "./newWord.conversation";
import { BotContext } from "../session";

const botConversations = {
    newWord: enterNewWord,
};

export default botConversations as Record<
    keyof typeof botConversations,
    { id: string; handler: ConversationFn<BotContext> }
>;
