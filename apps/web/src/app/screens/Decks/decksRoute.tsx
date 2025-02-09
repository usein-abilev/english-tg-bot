import { RouteObject } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";
import DeckReview from "./DeckReview/DeckReview";
import DeckCreate from "./DeckCreate/DeckCreate";
import DeckEdit from "./DeckEdit/DeckEdit";

const decksRoute: RouteObject = {
    children: [
        {
            path: ROUTES.DECKS,
            element: <p>Not implemented yet!</p>,
        },
        {
            path: ROUTES.DECKS_REVIEW,
            element: <DeckReview />,
        },
        {
            path: ROUTES.DECK_CREATE,
            element: <DeckCreate />,
        },
        {
            path: ROUTES.DECK_EDIT,
            element: <DeckEdit />,
        },
    ],
};

export default decksRoute;
