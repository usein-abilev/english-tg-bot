import React from "react";
import styled from "styled-components";
import NavigationBar from "../NavigationBar/NavigationBar";
import { useBackButton } from "../../hooks/useBackButton";
import { useLoaderData } from "react-router-dom";

const StyledContainer = styled.div`
    background: transparent;
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: var(--tgui--secondary_bg_color);

    .scrollable-container {
        height: 100%;
        overflow-y: auto;
    }
`;

function MainLayout({ children }: { children: React.ReactNode }) {
    useLoaderData();
    useBackButton();

    return (
        <StyledContainer>
            <div className="scrollable-container">{children}</div>

            <NavigationBar />
        </StyledContainer>
    );
}

export default MainLayout;
