export const ROUTES = {
    HOME: "/",
    DECKS: "/decks",
    DECKS_REVIEW: "/decks/:id",
    DECK_EDIT: "/decks/:id/edit",
    DECK_CREATE: "/decks/create",
    DECK_CARD_REVIEW: "/decks/:deckId/cards/:cardId",
    PRACTICE: "/practice",
    PROFILE: "/profile",
    LIBRARY: "/library",
    EXPLORE: "/explore",
    SETTINGS: "/settings",
};

/**
 * Replace route params with actual values.
 */
export const replaceRouteParams = (route: string, params: Record<string, string | number>) => {
    let newRoute = route;
    Object.entries(params).forEach(([key, value]) => {
        newRoute = newRoute.replace(`:${key}`, value.toString());
    });
    return newRoute;
};
