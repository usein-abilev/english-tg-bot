import { Bot, InlineKeyboard, session } from "grammy";
import { hydrate } from "@grammyjs/hydrate";
import { conversations, createConversation } from "@grammyjs/conversations";
import LanguageBotAPI from "../api";
import { setAPIProvider } from "./provider";
import { BotContext, BotSessionData } from "./session";
import initMiddleware from "./middleware/init.middleware";
import initLocalization, { localizeText } from "./localization";
import { logger } from "../utils/logger.util";
import { mainMenu, menusComposer } from "./menus";
import botConversations from "./conversations";
import dictionaryMenu, { getDictionaryMenuText } from "./menus/dictionary.menu";
import events from "../utils/events.util";
import practiceMenu, { getPracticeMenuText } from "./menus/practice.menu";

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
    bot.use(hydrate());
    bot.use(initMiddleware());
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
    bot.callbackQuery("start-practice", async (ctx) => {
        const [practiceText] = await Promise.all([
            getPracticeMenuText(ctx),
            ctx.answerCallbackQuery(),
            ctx.conversation.exit(),
        ]);
        await ctx.editMessageText(practiceText, {
            parse_mode: "HTML",
            reply_markup: practiceMenu,
        });
    });

    bot.catch(logger.error.bind(logger));

    return bot.start();
}

events.on("beginPractice", async (users) => {
    logger.debug("beginPractice event received: %d", users.length);
    for (const user of users) {
        const text = `<b>🔥 Время практики (бета).</b>\n\nДоступно <b>${user.userCardIds.length}</b> слов для практики`;
        await bot.api.sendMessage(user.userTelegramId, text, {
            parse_mode: "HTML",
            reply_markup: new InlineKeyboard().text("Начать практику", "start-practice"),
        });
    }
});

// graceful shutdown
process.once("SIGINT", () => bot.stop());
process.once("SIGTERM", () => bot.stop());
