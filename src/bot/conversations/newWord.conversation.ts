import { Conversation } from "@grammyjs/conversations";
import { InlineKeyboard } from "grammy";
import { BotContext } from "../session";
import { localizeText } from "../localization";
import { getAPIProvider } from "../provider";
import { createChildLogger } from "../../utils/logger.util";
import {
    checkSpelling,
    correctSpelling,
    SpellingCheckerMatch,
    SpellingIssueType,
    tidyWord,
} from "../../utils/spelling.util";
import { DictionaryResponseItem } from "../../api/services/dictionary.service";
import { TranslateOptions } from "../../api/services/translation.service";
import { SupportedLanguageCode } from "../../utils/lang.util";

const logger = createChildLogger("conversations:newWord");

const italicIfNotEmpty = (text?: string) => (text ? `<i>${text}</i>` : "");
const boldIfNotEmpty = (text?: string) => (text ? `<b>${text}</b>` : "");

const analyzeDictionaryResult = (dictionaryResult: DictionaryResponseItem[]) => {
    if (!dictionaryResult.length) return null;

    const result: {
        phonetic?: string;
        audio?: string;
        meanings: { example: string; definition: string; partOfSpeech: string }[];
    } = {
        meanings: [],
    };

    const [feature] = dictionaryResult;
    if (feature.phonetics) {
        // trying to find the us/uk phonetic first
        const phonetics = feature.phonetics.filter((p) => p.text);
        for (const p of phonetics) {
            if (p.audio?.includes("us")) {
                result.audio = p.audio;
                result.phonetic = p.text!;
                break;
            } else if (p.audio?.includes("uk")) {
                result.audio = p.audio;
                result.phonetic = p.text!;
            }
        }
    }
    if (!result.phonetic && feature.phonetic) {
        result.phonetic = feature.phonetic;
    }

    for (const meaning of feature.meanings) {
        const definition = meaning.definitions.sort((a, b) => {
            if (a.example && !b.example) return -1;
            if (!a.example && b.example) return 1;
            return 0;
        })[0];
        if (!definition) continue;
        result.meanings.push({
            example: definition.example || "",
            definition: definition.definition || "",
            partOfSpeech: meaning.partOfSpeech,
        });
    }

    return result;
};

const collectPhraseData = async (
    ctx: BotContext,
    phrase: string,
    detectedLanguage?: SupportedLanguageCode,
) => {
    const api = getAPIProvider();

    const sourceLanguage = detectedLanguage || SupportedLanguageCode.EN;
    const targetLanguage =
        sourceLanguage === SupportedLanguageCode.RU
            ? SupportedLanguageCode.EN
            : SupportedLanguageCode.RU;

    const translateAPIOptions: TranslateOptions = {
        alternatives: 1,
        source: "auto",
        format: "text",
        target: targetLanguage,
    };

    const tidiedPhrase = tidyWord(phrase.toLowerCase());
    const [dictionaryResult, phraseTranslateResult] = await Promise.all([
        api.dictionaryAPI.reveal(tidiedPhrase.text),
        api.translation.translate(phrase, translateAPIOptions),
    ]);

    const collectedDictionary = {
        imageURL: "",
        audioURL: "",
        phonetic: "",
        meanings: [] as {
            definition: string;
            partOfSpeech: string;
            example: string;
            translatedDefinition?: string;
            translatedExample?: string;
        }[],
    };

    const collected = {
        phrase,
        sourceLanguage,
        targetLanguage,
        alternative: "",
        translatedPhrase: "",
        dictionary: undefined as typeof collectedDictionary | undefined,
    };

    if (phraseTranslateResult.ok) {
        collected.translatedPhrase = phraseTranslateResult.data.translatedText;
        collected.alternative = phraseTranslateResult.data.alternatives[0] || "";
    }

    if (dictionaryResult.ok) {
        // If the word is found in the dictionary, we can use the meaning from there
        const analyzed = analyzeDictionaryResult(dictionaryResult.data);
        if (!analyzed) return collected;
        logger.debug("Analyzed dictionary result: %o", analyzed);

        const meanings = await Promise.all(
            analyzed.meanings.slice(0, 2).map(async (m) => {
                return {
                    definition: m.definition,
                    partOfSpeech: m.partOfSpeech,
                    example: m.example,
                    translatedDefinition: await api.translation
                        .translate(m.definition, translateAPIOptions)
                        .then((r) => (r.ok ? r.data.translatedText : "")),
                    translatedExample: m.example
                        ? await api.translation
                              .translate(m.example, translateAPIOptions)
                              .then((r) => (r.ok ? r.data.translatedText : ""))
                        : "",
                };
            }),
        );

        collected.dictionary = collectedDictionary;
        collected.dictionary.meanings = meanings;
        collected.dictionary.phonetic = analyzed.phonetic || "";
        if (analyzed.audio) {
            collected.dictionary.audioURL = analyzed.audio;
        }
    } else {
        collected.dictionary = undefined;
    }

    return collected;
};

async function enterNewWord(conversation: Conversation<BotContext>, ctx: BotContext) {
    const api = getAPIProvider();

    await ctx.reply(localizeText(ctx, "menu.dictionary.messages.request-word"), {
        parse_mode: "HTML",
    });

    let phrase: string;
    let detectedLanguage: SupportedLanguageCode;

    ask_user_word: while (true) {
        const phraseCtx = await conversation.waitFor(":text");
        phrase = phraseCtx.msg.text.trim();

        const correctness = await checkSpelling(phrase);
        logger.debug('Correctness "%s": %o', phrase, correctness);
        const checkedLanguage = correctness.language.detectedLanguage?.code || "en-US";
        detectedLanguage =
            checkedLanguage === "ru-RU" ? SupportedLanguageCode.RU : SupportedLanguageCode.EN;

        const misspellings: SpellingCheckerMatch[] = [];
        for (const match of correctness.matches) {
            if (match.replacements.length === 1 && match.type.typeName === "Other") {
                // Little adjustments to the phrase
                // For example 'i' -> 'I', 'what is' -> 'What is'
                const suggestion = match.replacements[0].value;
                const replaced = correctSpelling(phrase, [
                    {
                        change: suggestion,
                        length: match.length,
                        offset: match.offset,
                    },
                ]);
                logger.debug("Auto-corrected word: from '%s' to '%s'", phrase, replaced);
                phrase = replaced;
            } else if (match.rule.issueType === SpellingIssueType.MISSPELLING) {
                misspellings.push(match);
            }
        }

        if (misspellings.length > 0) {
            logger.debug("Misspelling found of '%s': %o", phrase, misspellings);
            while (misspellings.length) {
                const match = misspellings.shift();
                if (!match) break;

                const isWord = match.word === phrase;
                const wordOrPhrase = isWord ? "spelling-word-error" : "spelling-error";
                const message = localizeText(ctx, `menu.dictionary.messages.${wordOrPhrase}`, {
                    word: match.word,
                    phrase,
                });

                if (match.replacements.length === 0) {
                    await ctx.reply(
                        localizeText(ctx, "menu.dictionary.messages.spelling-error-repeat", {
                            phrase: match.word,
                        }),
                        { parse_mode: "HTML" },
                    );
                    continue ask_user_word;
                }

                const optionsKeyboard = new InlineKeyboard();
                const callbackQueries: string[] = [];
                for (const suggestion of match.replacements.slice(0, 5)) {
                    const data = `replace-${suggestion.value}`;
                    callbackQueries.push(data);
                    optionsKeyboard.text(suggestion.value, data).row();
                }

                callbackQueries.push("back");
                optionsKeyboard.text(localizeText(ctx, "buttons.back"), "back");

                await ctx.reply(message, {
                    parse_mode: "HTML",
                    reply_markup: optionsKeyboard,
                });

                const callbackCtx = await conversation.waitForCallbackQuery(callbackQueries);
                const callbackData = callbackCtx.callbackQuery.data;
                await callbackCtx.answerCallbackQuery();
                await callbackCtx.deleteMessage();
                if (callbackData.startsWith("replace-")) {
                    const suggestion = callbackData.slice("replace-".length);
                    phrase = correctSpelling(phrase, [
                        {
                            change: suggestion,
                            length: match.length,
                            offset: match.offset,
                        },
                    ]);
                    logger.debug("Corrected word: %s", phrase);
                } else if (callbackData === "back") {
                    return await ctx.reply(
                        localizeText(ctx, "menu.dictionary.messages.card-cancelled", {
                            phrase,
                        }),
                        {
                            reply_markup: new InlineKeyboard().text(
                                localizeText(ctx, "buttons.back"),
                                "dictionary-menu",
                            ),
                        },
                    );
                }
            }
            detectedLanguage = SupportedLanguageCode.EN;
        }

        break;
    }

    const alreadyExists = await conversation.external(() =>
        api.cardExists(ctx.session.user.id, phrase),
    );
    if (alreadyExists) {
        await ctx.reply(
            localizeText(ctx, "menu.dictionary.messages.card-already-exists", {
                phrase,
            }),
            {
                parse_mode: "HTML",
                reply_markup: new InlineKeyboard().text(
                    localizeText(ctx, "buttons.cancel"),
                    "dictionary-menu",
                ),
            },
        );
        return;
    }

    const collected = await collectPhraseData(ctx, phrase, detectedLanguage);
    const title =
        `<b>${collected.phrase}</b> ${italicIfNotEmpty(collected.dictionary?.phonetic)} - ` +
        `${collected.translatedPhrase} (${collected.alternative})`;

    const footer = "\n\n" + boldIfNotEmpty("Вы хотите добавить это слово в словарь?");

    const confirmKeyboard = new InlineKeyboard()
        .text(localizeText(ctx, "buttons.confirm"), "confirm")
        .text(localizeText(ctx, "buttons.cancel"), "cancel");

    if (collected.dictionary) {
        const meanings = collected.dictionary.meanings.map((m) => {
            let text = `🟢 <b>[${m.partOfSpeech}]</b> ${m.definition}`;
            if (m.translatedDefinition) {
                const label = localizeText(ctx, "menu.dictionary.terms.phrase-definition");
                text += `\n🔵 <b>${label}</b> ${m.translatedDefinition}`;
            }
            if (m.translatedExample) {
                const label = localizeText(ctx, "menu.dictionary.terms.phrase-usage");
                text += `\n🔵 <b>${label}</b> ${m.example} (${m.translatedExample})`;
            }
            return text;
        });

        const message = `${title}\n\n${meanings.join("\n\n")}` + footer;
        if (collected.dictionary.audioURL) {
            await ctx.replyWithVoice(collected.dictionary.audioURL, {
                parse_mode: "HTML",
                caption: message,
                reply_markup: confirmKeyboard,
            });
        } else {
            await ctx.reply(message, {
                parse_mode: "HTML",
                reply_markup: confirmKeyboard,
            });
        }
    } else {
        // only translate available
        await ctx.reply(title + footer, {
            parse_mode: "HTML",
            reply_markup: confirmKeyboard,
        });
    }

    const confirmCtx = await conversation.waitForCallbackQuery(["confirm", "cancel"]);
    await confirmCtx.answerCallbackQuery();
    const confirmed = confirmCtx.callbackQuery.data === "confirm";

    let text: string;
    if (confirmed) {
        const result = await conversation.external(() => {
            return api
                .addCard(ctx.session.user.id, {
                    text: phrase,
                    sourceLangCode: detectedLanguage,
                    targetLangCode: collected.targetLanguage,
                    translation: collected.translatedPhrase,
                    meanings:
                        collected.dictionary?.meanings?.map((m) => ({
                            example: m.example,
                            audioUrl: collected.dictionary?.audioURL || "",
                            phonetic: collected.dictionary?.phonetic || "",
                            definition: m.definition,
                            partOfSpeech: m.partOfSpeech,
                            translatedDefinition: m.translatedDefinition || "",
                            translatedExample: m.translatedExample || "",
                        })) || [],
                })
                .catch(() => null);
        });
        if (!result) {
            text = localizeText(ctx, "menu.dictionary.messages.card-failed");
        } else {
            text = localizeText(ctx, "menu.dictionary.messages.card-added", {
                phrase,
            });
        }
    } else {
        text = localizeText(ctx, "menu.dictionary.messages.card-cancelled", {
            phrase,
        });
    }

    await confirmCtx.deleteMessage();
    await confirmCtx.reply(text, {
        parse_mode: "HTML",
        reply_markup: new InlineKeyboard().text(
            localizeText(ctx, "buttons.back"),
            "dictionary-menu",
        ),
    });
}

export default {
    id: "enterNewWord",
    handler: enterNewWord,
};
