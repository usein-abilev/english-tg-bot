import { Bot, session } from "grammy";
import LanguageBotAPI from "../api";
import { setAPIProvider } from "./provider";
import { BotContext, BotSessionData } from "./session";
import initMiddleware from "./middleware/init.middleware";
import { conversations, createConversation } from "@grammyjs/conversations";
import initLocalization, { localizeText } from "./localization";
import { logger } from "../utils/logger.util";
import { mainMenu, menusComposer } from "./menus";
import botConversations from "./conversations";
import dictionaryMenu, { getDictionaryMenuText } from "./menus/dictionary.menu";
import { hydrateContext } from "@grammyjs/hydrate";

const bot = new Bot<BotContext>(process.env.TG_BOT_TOKEN as string);

export default async function initializeTgBot(api: LanguageBotAPI) {
    setAPIProvider(api);
    await initLocalization();

    bot.use(
        session({
            initial(): BotSessionData {
                return { user: { id: 0, languageCode: "en" } };
            },
        }),
    );
    bot.use(initMiddleware());
    bot.use(hydrateContext());
    bot.use(conversations());

    bot.use(
        createConversation(botConversations.newWord.handler, { id: botConversations.newWord.id }),
    );
    bot.use(menusComposer);

    bot.command("start", (ctx) =>
        ctx.reply(localizeText(ctx, "menu.start.text"), { reply_markup: mainMenu }),
    );
    bot.callbackQuery("menu", async (ctx) => {
        await ctx.conversation.exit();
        await ctx.editMessageText(localizeText(ctx, "menu.start.text"), { reply_markup: mainMenu });
    });
    bot.callbackQuery("dictionary-menu", async (ctx) => {
        await ctx.conversation.exit();
        await ctx.editMessageText(await getDictionaryMenuText(ctx), {
            parse_mode: "HTML",
            reply_markup: dictionaryMenu,
        });
    });

    bot.catch(logger.error.bind(logger));

    return bot.start();
}

// graceful shutdown
process.once("SIGINT", () => {
    console.log("SIGINT received, stopping bot...");
    return bot.stop();
});
process.once("SIGTERM", () => {
    console.log("SIGTERM received, stopping bot...");
    return bot.stop();
});
