import { InlineButtons } from "@telegram-apps/telegram-ui";
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import * as Icons from "../icons";
import { ROUTES } from "../../constants/routes";
import { useLocation, useNavigate } from "react-router-dom";

const NavigationBarStyled = styled.div`
    background: var(--tgui--bg_color);
    .nav-buttons {
        display: flex;
        width: 100%;

        .nav-button span,
        .nav-button svg {
            pointer-events: none;
        }

        button.nav-button {
            width: 100%;
            border: none;
            background: transparent;
            color: var(--tgui--text_color);
            fill: var(--tgui--text_color);
            stroke: var(--tgui--text_color);
            cursor: pointer;

            color: var(--tgui--section_header_text_color);
            padding: 10px 0px;
            font-family: var(--tgui--font-family);
            font-size: 10px;
            line-height: 12px;
            font-weight: 500;

            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 6px;

            transition: all 0.1s;

            &.active {
                opacity: 1;
                color: var(--tgui--link_color);
                fill: var(--tgui--link_color);
                stroke: var(--tgui--link_color);
            }
            &:hover {
                opacity: 0.7;
            }
            &:active {
                opacity: 0.8;
            }
        }
    }
`;

const NAVIGATION_ROUTES = {
    home: ROUTES.HOME,
    search: "/search",
    library: "/library",
    profile: "/profile",
};

type NavigationTabs = "home" | "search" | "library" | "profile";

function NavigationBar({}) {
    const [activeTab, setActiveTab] = useState<NavigationTabs | null>(null);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.pathname === NAVIGATION_ROUTES.home) {
            setActiveTab("home");
        } else if (location.pathname === NAVIGATION_ROUTES.search) {
            setActiveTab("search");
        } else if (location.pathname === NAVIGATION_ROUTES.library) {
            setActiveTab("library");
        } else if (location.pathname === NAVIGATION_ROUTES.profile) {
            setActiveTab("profile");
        } else {
            setActiveTab(null);
        }
    }, [location]);

    const getActiveTabClass = useCallback(
        (tab: NavigationTabs) => {
            return activeTab === tab ? "active" : "";
        },
        [activeTab],
    );

    const handleMenuClick = useCallback(
        (event: any) => {
            const tab = event.currentTarget.dataset.id as NavigationTabs;
            setActiveTab(tab);
            navigate(NAVIGATION_ROUTES[tab]);
        },
        [navigate, setActiveTab],
    );

    return (
        <NavigationBarStyled className="footer">
            <div className="nav-buttons">
                <button
                    className={`nav-button ${getActiveTabClass("home")}`}
                    data-id="home"
                    onClick={handleMenuClick}
                >
                    <Icons.IconHome />
                </button>
                <button
                    className={`nav-button ${getActiveTabClass("search")}`}
                    data-id="search"
                    onClick={handleMenuClick}
                >
                    <Icons.IconSearch />
                </button>
                <button className="nav-button">
                    <Icons.IconAdd />
                </button>
                <button
                    className={`nav-button ${getActiveTabClass("library")}`}
                    data-id="library"
                    onClick={handleMenuClick}
                >
                    <Icons.IconLibrary />
                </button>
                <button
                    className={`nav-button ${getActiveTabClass("profile")}`}
                    data-id="profile"
                    onClick={handleMenuClick}
                >
                    <Icons.IconProfile />
                </button>
            </div>
        </NavigationBarStyled>
    );
}

export default NavigationBar;
