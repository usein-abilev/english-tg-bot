import { Menu } from "@grammyjs/menu";
import { logger } from "../../utils/logger.util";
import { localizeText } from "../localization";
import { getAPIProvider } from "../provider";
import { BotContext } from "../session";
import WordEntity from "../../api/db/entities/word.entity";

async function advanceDiscoveryWord(ctx: BotContext) {
    if (!ctx.session.discovery) {
        logger.error("No discovery session found in the context.");
        return null;
    }
    const discovery = ctx.session.discovery;
    if (!discovery.words.length) {
        logger.debug("No more words to discover.");
        return null;
    }
    discovery.current = discovery!.words.shift();
    discovery.distractions = await createWordDistractions(ctx, discovery.current!);
    return discovery.current;
}

export async function getDiscoveryMenuText(ctx: BotContext) {
    return localizeText(ctx, "menu.discovery.text");
}

async function openDiscoveryMenu(ctx: BotContext) {
    return ctx.editMessageText(await getDiscoveryMenuText(ctx), {
        parse_mode: "HTML",
    });
}

const getQuizWordMessageText = (ctx: BotContext, word: WordEntity) => {
    return localizeText(ctx, "menu.discovery.messages.how-to-translate", {
        word: word.name.toLowerCase(),
        phonetic: word.metadata?.phonetic,
    });
};

/**
 * Loads cards to discovery from the API and stores them in the session.
 */
async function loadDiscoveryWords(ctx: BotContext) {
    logger.debug("Loading discovery words: %o", ctx.session.discovery);
    const api = getAPIProvider();
    const words = await api.getRandomWords({ limit: 50 });
    ctx.session.discovery = { words, loadedCount: words.length };
}

async function createWordDistractions(ctx: BotContext, word: WordEntity) {
    const api = getAPIProvider();
    const words = await api.getRandomWords({ limit: 2, exclude: [word.name] });
    const translated = await api.translation.translateBatch(
        [word.name, ...words.map((w) => w.name)],
        {
            format: "text",
            source: "auto",
            target: "ru",
            alternatives: 0,
        },
    );
    console.log("Generated extra words for word, translation", word.name, words, translated);
    if (!translated.ok) {
        logger.error("Failed to translate extra words", translated.error);
        return [];
    }
    if (translated.data.length < 3) {
        logger.error("Not enough translations for extra words", translated.data);
        return [];
    }
    const [correctWordTranslation] = translated.data;
    const correct = correctWordTranslation.translatedText.toLowerCase();
    return translated.data
        .map((item) => {
            const text = item.translatedText.toLowerCase();
            return {
                correct: text === correct,
                text,
            };
        })
        .sort(() => Math.random() - 0.5);
}

const WORD_RESULT_MENU_ID = "discovery-result-menu";
const quizWordResultMenu = new Menu<BotContext>(WORD_RESULT_MENU_ID)
    .text(
        (ctx) => localizeText(ctx, "menu.discovery.buttons.next-word"),
        async (ctx) => {
            const word = ctx.session.discovery?.current;
            if (!word) {
                return ctx.editMessageText(await getDiscoveryMenuText(ctx), {
                    parse_mode: "HTML",
                    reply_markup: discoveryMenu,
                });
            }
            ctx.menu.nav(START_DISCOVERY_MENU_ID);
            await ctx.editMessageText(
                getQuizWordMessageText(ctx, ctx.session.discovery!.current!),
                {
                    parse_mode: "HTML",
                },
            );
        },
    )
    .row()
    .back((ctx) => localizeText(ctx, "buttons.home"));

const START_DISCOVERY_MENU_ID = "start-discovery-menu";
const startDiscoveryMenu = new Menu<BotContext>(START_DISCOVERY_MENU_ID)
    .dynamic(async (ctx, range) => {
        const current = ctx.session.discovery?.current;
        if (!current) {
            logger.error("No current word in the discovery session.");
            return range;
        }
        const distractions = ctx.session.discovery?.distractions || [];
        const correct = distractions.find((d) => d.correct);
        for (const word of distractions) {
            range.submenu(word.text, WORD_RESULT_MENU_ID, async (ctx) => {
                const templateKey = word.correct ? "correct-answer" : "wrong-answer";
                const message = localizeText(ctx, `menu.discovery.messages.${templateKey}`, {
                    word: current.name,
                    translation: correct!.text,
                });
                await Promise.all([
                    advanceDiscoveryWord(ctx),
                    ctx.editMessageText(message, {
                        parse_mode: "HTML",
                    }),
                ]);
            });
            range.row();
        }
        return range;
    })
    .row()
    .back(
        (ctx) => localizeText(ctx, "buttons.home"),
        (ctx) => openDiscoveryMenu(ctx),
    );

startDiscoveryMenu.register(quizWordResultMenu);

export const DISCOVERY_MENU_ID = "discover-menu";

const discoveryMenu = new Menu<BotContext>(DISCOVERY_MENU_ID)
    .submenu(
        (ctx) => localizeText(ctx, "menu.discovery.buttons.start"),
        START_DISCOVERY_MENU_ID,
        async (ctx) => {
            await loadDiscoveryWords(ctx);
            const word = await advanceDiscoveryWord(ctx);
            if (!word) {
                logger.debug("discovery: no words to discovery", ctx.session.discovery);
                return ctx
                    .editMessageText(localizeText(ctx, "menu.discovery.text-empty"))
                    .catch(async () => {
                        await ctx.deleteMessage();
                    });
            }
            return ctx.editMessageText(getQuizWordMessageText(ctx, word), {
                parse_mode: "HTML",
            });
        },
    )
    .row()
    .back(
        (ctx) => localizeText(ctx, "buttons.back"),
        (ctx) => ctx.editMessageText(localizeText(ctx, "menu.start.text")),
    );

discoveryMenu.register(startDiscoveryMenu);

export default discoveryMenu;
