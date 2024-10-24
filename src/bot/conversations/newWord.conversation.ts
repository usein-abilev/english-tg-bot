import { Conversation } from "@grammyjs/conversations";
import { InlineKeyboard } from "grammy";
import { BotContext } from "../session";
import { localizeText } from "../localization";
import { getAPIProvider } from "../provider";
import { logger } from "../../utils/logger.util";

async function enterNewWord(conversation: Conversation<BotContext>, ctx: BotContext) {
    const api = getAPIProvider();

    await ctx.reply(localizeText(ctx, "menu.dictionary.messages.request-word"));
    const phraseCtx = await conversation.waitFor(":text");
    const phrase = phraseCtx.msg.text.trim();

    const alreadyExists = await conversation.external(() =>
        api.cardExists(ctx.session.user.id, phrase),
    );
    if (alreadyExists) {
        await ctx.reply(
            localizeText(ctx, "menu.dictionary.messages.card-already-exists", { phrase }),
            {
                parse_mode: "HTML",
                reply_markup: new InlineKeyboard().text(
                    localizeText(ctx, "buttons.back"),
                    "dictionary-menu",
                ),
            },
        );
        return;
    }

    const dictionaryResult = await conversation.external(() =>
        api.dictionaryAPI.reveal(phrase.toLowerCase()),
    );

    if (dictionaryResult.ok) {
        // If the word is found in the dictionary, we can use the meaning from there
        logger.debug("Found word in the dictionary: %s", phrase, dictionaryResult.data);
        // const phonetic = dictionaryResult.data.find((d) => d.phonetic);
        // const message =
        //     `<b>${phrase}</b> <i>${phonetic}</i>` +
        //     `\n\n${dictionaryResult.data.map((d) => d.meaning).join("\n")}`;
    }

    await ctx.reply(localizeText(ctx, "menu.dictionary.messages.request-meaning", { phrase }), {
        parse_mode: "HTML",
    });
    const meaningCtx = await conversation.waitFor(":text");
    const meaning = meaningCtx.msg.text;

    await ctx.reply(
        localizeText(ctx, "menu.dictionary.messages.request-confirm", { phrase, meaning }),
        {
            parse_mode: "HTML",
            reply_markup: new InlineKeyboard()
                .text(
                    localizeText(ctx, "menu.dictionary.messages.confirm-answer.confirm"),
                    "confirm",
                )
                .text(
                    localizeText(ctx, "menu.dictionary.messages.confirm-answer.cancel"),
                    "cancel",
                ),
        },
    );

    const confirmCtx = await conversation.waitForCallbackQuery(["confirm", "cancel"]);
    await confirmCtx.answerCallbackQuery();
    const confirmed = confirmCtx.callbackQuery.data === "confirm";

    let text: string;
    if (confirmed) {
        const result = await conversation.external(() =>
            api
                .addCard(ctx.session.user.id, {
                    text: phrase,
                    meaning,
                })
                .catch(() => null),
        );
        if (!result) {
            text = localizeText(ctx, "menu.dictionary.messages.card-failed");
        } else {
            text = localizeText(ctx, "menu.dictionary.messages.card-added", { phrase });
        }
    } else {
        text = localizeText(ctx, "menu.dictionary.messages.card-cancelled", { phrase });
    }

    await ctx.reply(text, {
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
