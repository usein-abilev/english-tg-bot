import { Menu } from "@grammyjs/menu";
import { InlineKeyboard } from "grammy";
import { logger } from "../../utils/logger.util";
import { localizeText } from "../localization";
import { getAPIProvider } from "../provider";
import { BotContext } from "../session";
import UserCardEntity from "../../api/db/entities/userCard.entity";

async function advancePracticeCard(ctx: BotContext) {
    if (!ctx.session.practice) {
        logger.error("No practice session found in the context.");
        return null;
    }
    const practice = ctx.session.practice!;
    return (practice!.current = practice!.cards.shift());
}

export async function getPracticeMenuText(ctx: BotContext) {
    const api = getAPIProvider();
    const count = await api.getUserCardsCount(ctx.session.user.id);
    return count === 0
        ? localizeText(ctx, "menu.practice.text-empty")
        : localizeText(ctx, "menu.practice.text", { count });
}

async function openPracticeMenu(ctx: BotContext) {
    return ctx.editMessageText(await getPracticeMenuText(ctx), {
        parse_mode: "HTML",
    });
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
    ctx.session.practice = { cards, loadedCount: cards.length, total: cards.length };
}

const START_PRACTICE_MENU_ID = "start-practice";
const startPracticeMenu = new Menu<BotContext>(START_PRACTICE_MENU_ID)
    .text(
        (ctx) => localizeText(ctx, "menu.practice.buttons.reveal"),
        async (ctx) => {
            if (!ctx.session.practice) {
                logger.error("No practice session found in the context.");
                return;
            }
            const current = ctx.session.practice.current!;
            const message = getCardMessageText(ctx, current, true);
            await ctx.editMessageText(`${message}\n\nHow well do you now this word?`, {
                parse_mode: "HTML",
                reply_markup: new InlineKeyboard()
                    .text(localizeText(ctx, "menu.practice.buttons.know-level-0"), "card-rate-0")
                    .row()
                    .text(localizeText(ctx, "menu.practice.buttons.know-level-1"), "card-rate-1")
                    .row()
                    .text(localizeText(ctx, "menu.practice.buttons.know-level-2"), "card-rate-2")
                    .row()
                    .text(localizeText(ctx, "menu.practice.buttons.know-level-3"), "card-rate-3"),
            });
        },
    )
    .back((ctx) => localizeText(ctx, "menu.practice.buttons.stop"), openPracticeMenu);

export const PRACTICE_MENU_ID = "practice";

const getCardMessageText = (ctx: BotContext, userCard: UserCardEntity, reveal = false) => {
    const question = reveal ? "Слово:" : "Как переводится:";
    let message = `📚 ${question} <b>${userCard.word.name}</b>`;
    const phonetic = userCard.word.metadata?.phonetic;
    if (phonetic) message += ` <i>[${phonetic}]</i>`;
    if (reveal) {
        message += ` - ${userCard.word.metadata?.translationRu}`;
    }
    // if (userCard.card.meanings.length > 0) {
    //     const meanings = userCard.meanings.map((m) => {
    //         let text = `🟢 <b>[${m.partOfSpeech}]</b> ${m.definition}`;
    //         if (reveal && m.translatedDefinition) {
    //             const label = localizeText(ctx, "menu.dictionary.terms.phrase-definition");
    //             text += `\n🔵 <b>${label}</b> ${m.translatedDefinition}`;
    //         }
    //         if (m.example) {
    //             const label = localizeText(ctx, "menu.dictionary.terms.phrase-usage");
    //             text += `\n🔵 <b>${label}</b> ${m.example}`;
    //             if (reveal && m.translatedExample) {
    //                 text += ` (${m.translatedExample})`;
    //             }
    //         }
    //         return text;
    //     });
    //     message += `\n\n${meanings.join("\n\n")}`;
    // }
    return message;
};

const practiceMenu = new Menu<BotContext>(PRACTICE_MENU_ID)
    .submenu(
        (ctx) => localizeText(ctx, "menu.practice.buttons.start"),
        START_PRACTICE_MENU_ID,
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

            return ctx.editMessageText(getCardMessageText(ctx, card), {
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

export async function onCardRateCallbackQuery(ctx: BotContext, rate: number) {
    if (!ctx.session.practice || !ctx.session.practice.current) {
        await ctx.answerCallbackQuery("No practice session found.");
        await ctx.deleteMessage().catch(() => {});
        await sendPracticeMenu(ctx);
        return;
    }
    const card = ctx.session.practice.current;

    const api = getAPIProvider();
    try {
        await api.rateCard(ctx.session.user.id, card.id, rate);
    } catch (error) {
        logger.error("Failed to rate card", error);
        await ctx.answerCallbackQuery("Failed to rate the card.");
        return;
    }

    const nextCard = await advancePracticeCard(ctx);
    if (!nextCard) {
        await ctx.editMessageText(await getPracticeMenuText(ctx), {
            parse_mode: "HTML",
            reply_markup: practiceMenu,
        });
        return;
    }
    await ctx.editMessageText(getCardMessageText(ctx, nextCard), {
        parse_mode: "HTML",
        reply_markup: startPracticeMenu,
    });
}

export default practiceMenu;
