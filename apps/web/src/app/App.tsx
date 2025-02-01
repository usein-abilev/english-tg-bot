import React from "react";
import { AppRoot } from "@telegram-apps/telegram-ui";
import { QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { queryClient } from "../features/reactQuery";
import { userQuery } from "../features/api/user";
import { ROUTES } from "../constants/routes";
import { MainLayout } from "../components/layouts";
import { ErrorRecoveryScreen } from "./screens/error";
import Home from "./screens/Home";
import CardPractice from "./screens/CardPractice/CardPractice";
import DeckReview from "./screens/DeckReview/DeckReview";
import NewDeckForm from "./screens/NewDeckForm/NewDeckForm";

const loader = async () => {
    return queryClient.ensureQueryData(userQuery());
};

const router = createBrowserRouter([
    {
        path: ROUTES.HOME,
        loader,
        element: (
            <MainLayout>
                <Home />
            </MainLayout>
        ),
        errorElement: <ErrorRecoveryScreen />,
    },
    {
        path: ROUTES.DECK_REVIEW,
        loader,
        element: (
            <MainLayout>
                <DeckReview />
            </MainLayout>
        ),
        errorElement: <ErrorRecoveryScreen />,
    },
    {
        path: ROUTES.DECK_PRACTICE,
        loader,
        element: (
            <MainLayout>
                <CardPractice />
            </MainLayout>
        ),
        errorElement: <ErrorRecoveryScreen />,
    },
    {
        path: ROUTES.NEW_DECK,
        loader,
        element: (
            <MainLayout>
                <NewDeckForm />
            </MainLayout>
        ),
        errorElement: <ErrorRecoveryScreen />,
    },
    {
        path: "*",
        element: <Navigate to={ROUTES.HOME} replace />,
    },
]);

function App() {
    return (
        <AppRoot appearance="dark" platform="ios">
            <QueryClientProvider client={queryClient}>
                <React.Suspense fallback={<div className="">Loading...</div>}>
                    <RouterProvider router={router} />
                </React.Suspense>
            </QueryClientProvider>
        </AppRoot>
    );
}

export default App;
