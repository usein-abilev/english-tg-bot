import { getAPIProvider } from "../provider";
import { BotContext } from "../session";

export default function initMiddleware() {
    return async (ctx: BotContext, next: () => Promise<void>) => {
        if (!ctx.session.user.id) {
            const api = getAPIProvider();
            if (!ctx.from || !ctx.from.username) {
                throw new Error("User must have a username.");
            }
            const id = await api.createUserIfNotExists({
                username: ctx.from.username!,
                firstName: ctx.from.first_name || "",
                lastName: ctx.from.last_name || "",
                languageCode: ctx.from.language_code || "en",
            });
            ctx.session = { user: { id: id } };
        }
        return next();
    };
}
