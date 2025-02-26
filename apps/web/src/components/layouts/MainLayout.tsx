import React, { useEffect } from "react";
import styled from "styled-components";
import NavigationBar from "../NavigationBar/NavigationBar";
import { useBackButton } from "../../hooks/useBackButton";
import { Outlet, useLoaderData } from "react-router-dom";
import { SVGIconRoot } from "../SVGIcon/SVGIcon";

const StyledContainer = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: hsl(from var(--app-bg-color) h s calc(l + 2));

    .main-wrapper {
        max-width: 480px;
        width: 100%;
        height: 100vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background: var(--app-bg-color);

        .scrollable-container {
            height: 100%;
            overflow-y: auto;
        }
    }
`;

function MainLayout() {
    useLoaderData();
    useBackButton();

    useEffect(() => {
        window.Telegram.WebApp.ready();
        Telegram.WebApp.enableClosingConfirmation();
        Telegram.WebApp.SettingsButton.show();

        if (window.Telegram.WebApp.platform === "ios") {
            Telegram.WebApp.disableVerticalSwipes();
        }

        // @ts-ignore - lockOrientation is not in the types
        Telegram.WebApp.lockOrientation();

        if (!window.Telegram.WebApp.isExpanded) {
            window.Telegram.WebApp.expand();
        }

        const openSettings = () => {
            alert("settings not implemented yet");
        };

        Telegram.WebApp.SettingsButton.onClick(openSettings);

        return () => {
            window.Telegram.WebApp.disableClosingConfirmation();
            Telegram.WebApp.SettingsButton.offClick(openSettings);
        };
    }, []);

    return (
        <StyledContainer>
            <div className="main-wrapper">
                <div className="scrollable-container">{<Outlet />}</div>

                <NavigationBar />
                <SVGIconRoot />
            </div>
        </StyledContainer>
    );
}

export default MainLayout;
