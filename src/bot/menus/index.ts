import { Menu } from "@grammyjs/menu";
import { Composer, InlineKeyboard } from "grammy";
import { logger } from "../../utils/logger.util";
import { localizeText } from "../localization";
import { BotContext } from "../session";
import dictionaryMenu from "./dictionary.menu";
import { getAPIProvider } from "../provider";

const composer = new Composer<BotContext>();

const MENUS = {
    PRACTICE: "practice",
    START_PRACTICE: "start-practice",
    DICTIONARY: "dictionary",
    MAIN: "main",
};

const mainMenu = new Menu<BotContext>(MENUS.MAIN)
    .submenu(
        (ctx) => localizeText(ctx, "menu.start.buttons.practice"),
        MENUS.PRACTICE,
        openPracticeMenu,
    )
    .submenu(
        (ctx) => localizeText(ctx, "menu.start.buttons.dictionary"),
        MENUS.DICTIONARY,
        (ctx) => ctx.editMessageText(localizeText(ctx, "menu.dictionary.text")),
    );

async function advancePracticeCard(ctx: BotContext) {
    if (!ctx.session.practice) {
        logger.error("No practice session found in the context.");
        return null;
    }
    const practice = ctx.session.practice!;
    return (practice!.current = practice!.cards.shift());
}

async function getPracticeMenuText(ctx: BotContext) {
    const api = getAPIProvider();
    const count = await api.getUserCardsCount(ctx.session.user.id);
    return count === 0
        ? localizeText(ctx, "menu.practice.text-empty")
        : localizeText(ctx, "menu.practice.text", { count });
}

async function openPracticeMenu(ctx: BotContext) {
    try {
        return await ctx.editMessageText(await getPracticeMenuText(ctx), {
            parse_mode: "HTML",
            reply_markup: practiceMenu,
        });
    } catch (error) {
        logger.error("Error opening practice menu: %s", error);
    }
}

async function sendPracticeMenu(ctx: BotContext): Promise<void> {
    await ctx.reply(await getPracticeMenuText(ctx), {
        parse_mode: "HTML",
        reply_markup: practiceMenu,
    });
}

/**
 * Loads cards to practice from the API and stores them in the session.
 */
async function loadPracticeCards(ctx: BotContext) {
    const api = getAPIProvider();
    const cards = await api.getCardsToReview(ctx.session.user.id);
    ctx.session.practice = { cards };
}

const startPracticeMenu = new Menu<BotContext>(MENUS.START_PRACTICE)
    .text("👁️ Reveal", async (ctx) => {
        if (!ctx.session.practice) {
            logger.error("No practice session found in the context.");
            return;
        }
        const current = ctx.session.practice.current!;
        await ctx.editMessageText(
            `📚 Word: <b>${current.title}</b>\n📒 Meaning: <b>${current.meaning}</b>\n\nHow well do you now this word?`,
            {
                parse_mode: "HTML",
                reply_markup: new InlineKeyboard()
                    .text(localizeText(ctx, "menu.practice.buttons.know-level-0"), "card-rate-0")
                    .row()
                    .text(localizeText(ctx, "menu.practice.buttons.know-level-1"), "card-rate-1")
                    .row()
                    .text(localizeText(ctx, "menu.practice.buttons.know-level-2"), "card-rate-2")
                    .row()
                    .text(localizeText(ctx, "menu.practice.buttons.know-level-3"), "card-rate-3"),
            },
        );
    })
    .back((ctx) => localizeText(ctx, "menu.practice.buttons.stop"), openPracticeMenu);

const practiceMenu = new Menu<BotContext>(MENUS.PRACTICE)
    .submenu(
        (ctx) => localizeText(ctx, "menu.practice.buttons.start"),
        MENUS.START_PRACTICE,
        async (ctx) => {
            await loadPracticeCards(ctx);
            const card = await advancePracticeCard(ctx);
            if (!card) {
                logger.debug("practice: no cards to practice", ctx.session.practice);
                return ctx
                    .editMessageText(localizeText(ctx, "menu.practice.text-empty"))
                    .catch(async () => {
                        await ctx.deleteMessage();
                        await sendPracticeMenu(ctx);
                    });
            }
            return ctx.editMessageText(`📚 Word: <b>${card?.title}</b>`, {
                parse_mode: "HTML",
            });
        },
    )
    .row()
    .back(
        (ctx) => localizeText(ctx, "buttons.back"),
        (ctx) => ctx.editMessageText(localizeText(ctx, "menu.start.text")),
    );

practiceMenu.register(startPracticeMenu);
mainMenu.register(practiceMenu);
mainMenu.register(dictionaryMenu);

composer.use(mainMenu);
composer.callbackQuery(/card-rate-(\d)/, async (ctx) => {
    const rate = parseInt(ctx.match![1]);
    if (!ctx.session.practice || !ctx.session.practice.current) {
        await ctx.answerCallbackQuery("No practice session found.");
        await ctx.deleteMessage().catch(() => {});
        await sendPracticeMenu(ctx);
        return;
    }
    const card = ctx.session.practice.current;
    logger.debug("Rate word '%s' with %d", card.title, rate);

    // const api = getAPIProvider();
    // await api.rateCard(ctx.session.user.id,
    const nextCard = await advancePracticeCard(ctx);
    if (!nextCard) {
        await ctx.editMessageText(localizeText(ctx, "menu.practice.text"), {
            reply_markup: practiceMenu,
        });
        return;
    }
    await ctx.editMessageText(`📚 Word: ${nextCard.title}`, {
        parse_mode: "HTML",
        reply_markup: startPracticeMenu,
    });
});

export { composer as menusComposer, mainMenu, practiceMenu };
