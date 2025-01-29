import LanguageBotAPI from ".";
import events, { BeginPracticeArguments } from "../utils/events.util";
import { logger } from "../utils/logger.util";

const OBSERVER_INTERVAL = 5 * 60 * 1000; // 5 minutes

const catchErrorWrapper = (fn: () => Promise<void> | void) => async () => {
    try {
        await fn();
    } catch (error) {
        logger.error("Error in observer tick: %o", error);
    }
};

export default class PracticeObserver {
    private started = false;
    private intervalId: NodeJS.Timeout | null = null;
    private api: LanguageBotAPI;

    constructor(api: LanguageBotAPI) {
        this.api = api;
    }

    public start(immediately = true) {
        if (this.started) return;
        this.started = true;
        this.intervalId = setInterval(
            catchErrorWrapper(() => this.tick()),
            OBSERVER_INTERVAL,
        );
        if (immediately) {
            catchErrorWrapper(() => this.tick())();
        }
    }

    private async tick() {
        const users = await this.api.getUsersToPractice();
        logger.debug("Practice observer tick: %d users to practice", users.length);

        if (users.length) {
            const beginPracticeEvent: BeginPracticeArguments = users.map((user) => {
                return {
                    userId: user.id,
                    userTelegramId: user.telegramId,
                    userCardIds: user.cards.map((card) => card.id),
                };
            });
            events.emit("beginPractice", beginPracticeEvent);
            await this.api.updateLastPracticeDate(users.map((user) => user.id));
        }
    }
}
