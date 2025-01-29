import LanguageBotAPI from "../api";

let api: LanguageBotAPI;

export function setAPIProvider(instance: LanguageBotAPI) {
    if (api) {
        throw new Error("API instance is already set.");
    }
    api = instance;
}

export function getAPIProvider(): LanguageBotAPI {
    return api;
}
