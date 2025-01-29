import { AppRoot } from "@telegram-apps/telegram-ui";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import Home from "./screens/Home/Home";
import React from "react";
import { queryClient } from "../features/reactQuery";
import { QueryClientProvider } from "@tanstack/react-query";
import { userQuery } from "../features/api/user";
import NewDeck from "./screens/Deck/NewDeck/NewDeck";
import DeckInfo from "./screens/Deck/DeckInfo/DeckInfo";

const loader = async () => {
    return queryClient.ensureQueryData(userQuery());
};

const router = createBrowserRouter([
    {
        path: ROUTES.HOME,
        loader,
        element: <Home />,
        errorElement: <div>404</div>,
    },
    {
        path: ROUTES.DECK_INFO,
        loader,
        element: <DeckInfo />,
        errorElement: <div>404</div>,
    },
    {
        path: ROUTES.NEW_DECK,
        loader,
        element: <NewDeck />,
        errorElement: <div>404</div>,
    },
]);

function App() {
    return (
        <AppRoot appearance="light" platform="ios">
            <QueryClientProvider client={queryClient}>
                <React.Suspense fallback={<div className="">Loading...</div>}>
                    <RouterProvider router={router} />
                </React.Suspense>
            </QueryClientProvider>
        </AppRoot>
    );
}

export default App;
