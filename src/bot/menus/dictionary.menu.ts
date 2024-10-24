import { Menu, MenuRange } from "@grammyjs/menu";
import botConversations from "../conversations";
import { localizeText } from "../localization";
import { BotContext } from "../session";

const dictionaryMenu = new Menu<BotContext>("dictionary")
    .dynamic(() => {
        const range = new MenuRange<BotContext>();
        for (const word of ["1", "2"]) {
            range.text(word, (ctx) => ctx.reply(`You chose ${word}`)).row();
        }
        return range;
    })
    .text(
        (ctx) => localizeText(ctx, "menu.dictionary.buttons.add-word"),
        (ctx) => ctx.conversation.enter(botConversations.newWord.id),
    )
    .back(
        (ctx) => localizeText(ctx, "buttons.back"),
        (ctx) => ctx.editMessageText(localizeText(ctx, "menu.start.text")),
    );

export default dictionaryMenu;
