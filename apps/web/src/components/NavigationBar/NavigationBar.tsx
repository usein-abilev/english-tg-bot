import { InlineButtons } from "@telegram-apps/telegram-ui";
import React from "react";
import styled from "styled-components";

const NavigationBarStyled = styled.div`
    background: var(--tgui--bg_color);

    .nav-buttons {
        display: flex;
        /* justify-content: space-between; */

        button.nav-button {
            background: var(--tgui--bg_color);
            border: none;
            color: var(--tgui--text_color);
            font-size: 1rem;
            cursor: pointer;

            width: 100%;
            color: var(--tgui--section_header_text_color);
            padding: 12px 0px;
            font-size: 14px;
        }
    }
`;

function NavigationBar(props) {
    return (
        <NavigationBarStyled className="footer">
            <div className="nav-buttons">
                <button className="nav-button">Home</button>
                <button className="nav-button">Library</button>
                <button className="nav-button">Add</button>
                <button className="nav-button">Progress</button>
                <button className="nav-button">Settings</button>
            </div>
        </NavigationBarStyled>
    );
}

export default NavigationBar;
