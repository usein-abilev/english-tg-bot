import React from "react";
import { AppRoot } from "@telegram-apps/telegram-ui";
import { QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { queryClient } from "../features/reactQuery";
import { createUserQuery } from "../features/api/user";
import { ROUTES } from "../constants/routes";
import { MainLayout } from "../components/Layouts";
import { ErrorRecoveryScreen } from "./screens/Error";
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
        children: [
            {
                path: "",
                lazy: async () => {
                    const { default: Component } = await import("./screens/Home");
                    return { element: <Component /> };
                },
            },
            decksRoute,
        ],
    },
    {
        path: ROUTES.PRACTICE,
        loader,
        element: <MainLayout />,
        children: [
            {
                path: "",
                lazy: async () => {
                    const { default: Component } = await import("./screens/Practice/CardPractice");
                    return { element: <Component /> };
                },
            },
        ],
        errorElement: <ErrorRecoveryScreen />,
    },
    {
        path: ROUTES.PROFILE,
        loader,
        element: <MainLayout />,
        children: [
            {
                path: "",
                lazy: async () => {
                    const { default: Component } = await import("./screens/Profile/Profile");
                    return { element: <Component /> };
                },
            },
        ],
        errorElement: <ErrorRecoveryScreen />,
    },
    {
        path: ROUTES.LIBRARY,
        loader,
        element: <MainLayout />,
        children: [
            {
                path: "",
                lazy: async () => {
                    const { default: Component } = await import("./screens/Library/Library");
                    return { element: <Component /> };
                },
            },
        ],
        errorElement: <ErrorRecoveryScreen />,
    },
    {
        path: ROUTES.EXPLORE,
        loader,
        element: <MainLayout />,
        children: [
            {
                path: "",
                lazy: async () => {
                    const { default: Component } = await import("./screens/Explore/Explore");
                    return { element: <Component /> };
                },
            },
        ],
        errorElement: <ErrorRecoveryScreen />,
    },
    {
        path: "*",
        element: <Navigate to={ROUTES.HOME} replace />,
    },
]);

function App() {
    return (
        <AppRoot appearance="dark" platform="ios" className="AppRoot-component">
            <React.Suspense fallback={<div className="">Loading...</div>}>
                <QueryClientProvider client={queryClient}>
                    <RouterProvider fallbackElement={<div>LOADING</div>} router={router} />
                </QueryClientProvider>
            </React.Suspense>
        </AppRoot>
    );
}

export default App;
