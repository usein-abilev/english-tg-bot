import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";

const IGNORE_PATHS = [ROUTES.HOME, ROUTES.EXPLORE, ROUTES.LIBRARY, ROUTES.PROFILE];

export const useBackButton = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const hideButton = IGNORE_PATHS.includes(location.pathname);

    useEffect(() => {
        if (hideButton) {
            Telegram.WebApp.BackButton.hide();
            return;
        }
        const onClick = () => navigate(-1);

        Telegram.WebApp.BackButton.show();
        Telegram.WebApp.BackButton.onClick(onClick);

        return () => {
            Telegram.WebApp.BackButton.offClick(onClick);
        };
    }, [navigate, hideButton]);
};
