import { RouteObject } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";
import DeckReview from "./DeckReview/DeckReview";
import DeckCreate from "./DeckCreate/DeckCreate";
import DeckEdit from "./DeckEdit/DeckEdit";
import DeckCardReview from "./DeckCardReview/DeckCardReview";

const decksRoute: RouteObject = {
    children: [
        {
            path: ROUTES.DECKS,
            element: <p>Not implemented yet!</p>,
        },
        {
            path: ROUTES.DECKS_REVIEW,
            // element: <DeckReview />,
            lazy: async () => {
                const { default: DeckReview } = await import("./DeckReview/DeckReview");
                return { element: <DeckReview /> };
            },
        },
        {
            path: ROUTES.DECK_CREATE,
            lazy: async () => {
                const { default: DeckCreate } = await import("./DeckCreate/DeckCreate");
                return { element: <DeckCreate /> };
            },
        },
        {
            path: ROUTES.DECK_EDIT,
            lazy: async () => {
                const { default: DeckEdit } = await import("./DeckEdit/DeckEdit");
                return { element: <DeckEdit /> };
            },
        },
        {
            path: ROUTES.DECK_CARD_REVIEW,
            lazy: async () => {
                const { default: DeckCardReview } = await import("./DeckCardReview/DeckCardReview");
                return { element: <DeckCardReview /> };
            },
        },
    ],
};

export default decksRoute;
