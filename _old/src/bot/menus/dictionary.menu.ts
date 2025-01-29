import { Menu } from "@grammyjs/menu";
import botConversations from "../conversations";
import { localizeText } from "../localization";
import { BotContext } from "../session";
import { getAPIProvider } from "../provider";

export const getDictionaryMenuText = async (ctx: BotContext) => {
    const api = getAPIProvider();
    const count = await api.getUserCardsCount(ctx.session.user.id);
    const message =
        count === 0
            ? localizeText(ctx, "menu.dictionary.messages.cards-empty")
            : localizeText(ctx, "menu.dictionary.messages.cards-count", { count });
    return `${localizeText(ctx, "menu.dictionary.title")}\n\n${message}`;
};

export const DICTIONARY_MENU_ID = "dictionary";

const dictionaryMenu = new Menu<BotContext>(DICTIONARY_MENU_ID)
    .text((ctx) => localizeText(ctx, "menu.dictionary.buttons.words"))
    .row()
    .text(
        (ctx) => localizeText(ctx, "menu.dictionary.buttons.add-word"),
        (ctx) => ctx.conversation.enter(botConversations.newWord.id),
    )
    .back(
        (ctx) => localizeText(ctx, "buttons.back"),
        (ctx) => ctx.editMessageText(localizeText(ctx, "menu.start.text")),
    );

export default dictionaryMenu;
