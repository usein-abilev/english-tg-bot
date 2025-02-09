import React from "react";
import { AppRoot } from "@telegram-apps/telegram-ui";
import { QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { queryClient } from "../features/reactQuery";
import { createUserQuery } from "../features/api/user";
import { ROUTES } from "../constants/routes";
import { MainLayout } from "../components/Layouts";
import { ErrorRecoveryScreen } from "./screens/Error";
import Home from "./screens/Home";
import CardPractice from "./screens/CardPractice/CardPractice";
import decksRoute from "./screens/Decks/decksRoute";

const loader = async () => {
    return queryClient.ensureQueryData(createUserQuery());
};

const router = createBrowserRouter([
    {
        path: "/",
        loader,
        element: <MainLayout />,
        errorElement: <ErrorRecoveryScreen />,
        children: [{ path: "", element: <Home /> }, decksRoute],
    },
    {
        path: ROUTES.DECK_PRACTICE,
        loader,
        element: <MainLayout />,
        children: [{ path: "", element: <CardPractice /> }],
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
            <React.Suspense fallback={<div className="">Loading...</div>}>
                <QueryClientProvider client={queryClient}>
                    <RouterProvider fallbackElement={<div>LOADING</div>} router={router} />
                </QueryClientProvider>
            </React.Suspense>
        </AppRoot>
    );
}

export default App;
