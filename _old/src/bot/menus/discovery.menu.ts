import { Menu, MenuFlavor } from "@grammyjs/menu";
import { logger } from "../../utils/logger.util";
import { localizeText } from "../localization";
import { getAPIProvider } from "../provider";
import { BotContext, BotSessionData } from "../session";
import WordMeaningEntity, { CardPartOfSpeech } from "../../api/db/entities/meaning.entity";

/**
 * Loads cards to discovery from the API and stores them in the session.
 */
async function loadDiscoveryWords(ctx: BotContext) {
    logger.debug("Loading discovery words: %o", ctx.session.discovery);
    const api = getAPIProvider();
    const words = await api.getRandomWords({ limit: 5, loadExamples: true });
    ctx.session.discovery = { words, loadedCount: words.length };
}

/**
 * Advances to the next word in the discovery session.
 * This function calls before the user sees the result of the previous word, keep that in mind.
 */
async function advanceDiscoveryWord(ctx: BotContext) {
    if (!ctx.session.discovery || !ctx.session.discovery.words.length) {
        await loadDiscoveryWords(ctx);
    }
    const discovery = ctx.session.discovery!;
    discovery.previous = discovery.current;
    discovery.current = discovery!.words.shift();
    if (!discovery.current) {
        return null;
    }
    const wordExamples = await getAPIProvider().getSentencesWithWord(discovery.current.name, 3);
    discovery.examples = wordExamples.map((s) => s.text);
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

const getQuizWordMessageText = (ctx: BotContext, discovery: BotSessionData["discovery"]) => {
    const word = discovery!.current!;
    const title = localizeText(ctx, "menu.discovery.messages.how-to-translate", {
        word: word.name.toLowerCase(),
        phonetic: word.word.metadata?.phonetic,
    });

    const examples = discovery!.examples!.map((s) => ` - ${s}`).join("\n");
    const examplesText = examples ? `\n\nПримеры использования:\n${examples}` : "";
    return `${title}${examplesText}\n\nВыберите один из вариантов ниже`;
};

const prepareWordForTranslation = (word: WordMeaningEntity) => {
    if (word.partOfSpeech === CardPartOfSpeech.VERB && !word.name.startsWith("to ")) {
        return `to ${word.name}`;
    } else if (
        word.partOfSpeech === CardPartOfSpeech.NOUN &&
        !(word.name.startsWith("a ") || word.name.startsWith("an "))
    ) {
        return `a ${word.name}`;
    }
    return word.name;
};

async function createWordDistractions(ctx: BotContext, word: WordMeaningEntity) {
    const api = getAPIProvider();
    const words = await api.getRandomWords({
        limit: 2,
        exclude: [word.name],
        partOfSpeech: word.partOfSpeech, // filter distractions by part of speech
    });
    const translated = await api.translation.translateBatch(
        [prepareWordForTranslation(word), ...words.map(prepareWordForTranslation)],
        {
            format: "text",
            source: "auto",
            target: "ru",
            alternatives: 0,
        },
    );
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
const onNextWordButtonClick = async (ctx: BotContext & MenuFlavor) => {
    const word = ctx.session.discovery?.current;
    if (!word) {
        return ctx.editMessageText(await getDiscoveryMenuText(ctx), {
            parse_mode: "HTML",
            reply_markup: discoveryMenu,
        });
    }
    ctx.menu.nav(DISCOVERY_QUIZ_MENU_ID);
    await ctx.editMessageText(getQuizWordMessageText(ctx, ctx.session.discovery), {
        parse_mode: "HTML",
    });
};

const quizWordResultMenu = new Menu<BotContext>(WORD_RESULT_MENU_ID)
    .text((ctx) => localizeText(ctx, "menu.discovery.buttons.next-word"), onNextWordButtonClick)
    .row()
    .text(
        (ctx) => localizeText(ctx, "menu.discovery.buttons.remember-word"),
        async (ctx) => {
            const msg = await ctx.reply("Слово будет добавлено в ваш словарь");
            console.log("Adding word to user's dictionary", ctx.session.discovery?.previous);
            // TODO: Add word to user's dictionary
            setTimeout(() => msg.delete(), 1500);
            return onNextWordButtonClick(ctx);
        },
    )
    .row()
    .back((ctx) => localizeText(ctx, "buttons.home"));

const DISCOVERY_QUIZ_MENU_ID = "discovery-quiz-menu";
const discoveryQuizMenu = new Menu<BotContext>(DISCOVERY_QUIZ_MENU_ID)
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

discoveryQuizMenu.register(quizWordResultMenu);

export const DISCOVERY_MENU_ID = "discover-menu";

const discoveryMenu = new Menu<BotContext>(DISCOVERY_MENU_ID)
    .submenu(
        (ctx) => localizeText(ctx, "menu.discovery.buttons.start"),
        DISCOVERY_QUIZ_MENU_ID,
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
            return ctx.editMessageText(getQuizWordMessageText(ctx, ctx.session.discovery), {
                parse_mode: "HTML",
            });
        },
    )
    .row()
    .back(
        (ctx) => localizeText(ctx, "buttons.back"),
        (ctx) => ctx.editMessageText(localizeText(ctx, "menu.start.text")),
    );

discoveryMenu.register(discoveryQuizMenu);

export default discoveryMenu;
