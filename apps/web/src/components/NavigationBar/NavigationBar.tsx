import { InlineButtons } from "@telegram-apps/telegram-ui";
import React, { useState } from "react";
import styled from "styled-components";
import * as Icons from "../icons";

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

            &.nav-profile {
                stroke: var(--tgui--text_color);
            }

            &:hover {
                opacity: 0.7;
            }

            &.active {
                opacity: 1;
                color: var(--tgui--link_color);
                fill: var(--tgui--link_color);

                &.nav-profile {
                    stroke: var(--tgui--link_color);
                }
            }
        }
    }
`;

function NavigationBar(props) {
    const activeElementRef = React.useRef<any>(null);

    const handleMenuClick = (event) => {
        if (activeElementRef.current) {
            activeElementRef.current.classList.remove("active");
        }
        activeElementRef.current = event.currentTarget;
        activeElementRef.current.classList.add("active");
        console.log("Menu id:", event.currentTarget.dataset.id);
    };

    return (
        <NavigationBarStyled className="footer">
            <div className="nav-buttons">
                <button className="nav-button" data-id="home" onClick={handleMenuClick}>
                    <Icons.IconHome />
                    <span>Home</span>
                </button>
                <button className="nav-button" data-id="search" onClick={handleMenuClick}>
                    <Icons.IconSearch />
                    <span>Search</span>
                </button>
                <button className="nav-button">
                    <Icons.IconAdd />
                </button>
                <button className="nav-button" data-id="library" onClick={handleMenuClick}>
                    {/* <IconProfile /> */}
                    <Icons.IconSearch />
                    <span>Library</span>
                </button>
                <button className="nav-button nav-profile" data-id="profile" onClick={handleMenuClick}>
                    <Icons.IconProfile />
                    <span>Profile</span>
                </button>
            </div>
        </NavigationBarStyled>
    );
}

export default NavigationBar;
