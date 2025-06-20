import botConfig from "../config";
import { BotContext } from "../session";
import { generateAuthHeaderFromUser } from "../utils/auth.utils";

export default function authMiddleware() {
    return async (ctx: BotContext, next: () => Promise<void>) => {
        if (!ctx.session.user?.id) {
            try {
                const authHeader = await generateAuthHeaderFromUser(ctx.from!);
                const result = await fetch(`${botConfig.apiUrl}/users/me`, {
                    headers: {
                        "x-tg-init-data": authHeader,
                    },
                });
                const body = await result.json();
                const user = body.data.user;
                ctx.session = {
                    user: {
                        id: user.id,
                        languageCode: user.languageCode,
                    },
                };
                return next();
            } catch (error) {
                console.error("authMiddleware: error:", error);
                await ctx.reply("An error occurred while processing your request.");
            }
        }
    };
}
