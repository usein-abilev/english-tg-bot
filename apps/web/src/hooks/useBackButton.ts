import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const useBackButton = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const hideButton = location.pathname === "/";

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
