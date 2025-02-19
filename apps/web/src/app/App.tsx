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
import CardPractice from "./screens/Practice/CardPractice";
import decksRoute from "./screens/Decks/decksRoute";
import Profile from "./screens/Profile/Profile";
import Library from "./screens/Library/Library";
import Explore from "./screens/Explore/Explore";

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
        path: ROUTES.PRACTICE,
        loader,
        element: <MainLayout />,
        children: [{ path: "", element: <CardPractice /> }],
        errorElement: <ErrorRecoveryScreen />,
    },
    {
        path: ROUTES.PROFILE,
        loader,
        element: <MainLayout />,
        children: [{ path: "", element: <Profile /> }],
        errorElement: <ErrorRecoveryScreen />,
    },
    {
        path: ROUTES.LIBRARY,
        loader,
        element: <MainLayout />,
        children: [{ path: "", element: <Library /> }],
        errorElement: <ErrorRecoveryScreen />,
    },
    {
        path: ROUTES.EXPLORE,
        loader,
        element: <MainLayout />,
        children: [{ path: "", element: <Explore /> }],
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
