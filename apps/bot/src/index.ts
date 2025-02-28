import * as dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

import { Bot, session } from "grammy";
import { hydrate } from "@grammyjs/hydrate";
import { BotContext } from "./session";
import authMiddleware from "./middlewares/auth.middleware";
import botConfig from "./config";

const bot = new Bot<BotContext>(process.env.TG_BOT_TOKEN as string);

(async function initializeTgBot() {
    bot.use(session({ initial: () => ({}) }));
    bot.use(hydrate());
    bot.use(authMiddleware());

    bot.command("start", (ctx) => {
        const username = ctx.from?.first_name || ctx.from?.username || "there";
        const message =
            `Hello, ${username}! 👋\n\nI’m your Spaced Repetition Bot – a mini-app designed to help you master words, terms, and languages effortlessly!\n\n` +
            `Here’s what I can do for you:\n` +
            `✨ Create and manage decks and flashcards\n` +
            `✨ Smartly repeat words based on your progress\n` +
            `✨ Send clever reminders to keep you on track\n` +
            `✨ Boost your learning with AI-powered features\n\n` +
            `Ready to supercharge your learning? Tap below to dive in! 🚀`;

        return ctx.reply(message, {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "Open Mini-App",
                            web_app: {
                                url: botConfig.webAppUrl,
                            },
                        },
                    ],
                ],
            },
        });
    });

    return bot.start();
})();

// graceful shutdown
process.once("SIGINT", () => bot.stop());
process.once("SIGTERM", () => bot.stop());
