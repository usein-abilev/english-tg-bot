import EventEmitter from "events";

export type BeginPracticeArguments = {
    userId: number;
    userTelegramId: number;
    userCardIds: number[];
}[];

interface BotEventsMap {
    beginPractice: BeginPracticeArguments[];
}

const events = new EventEmitter<BotEventsMap>();
export default events;
