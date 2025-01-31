import { Section } from "@telegram-apps/telegram-ui";
import React, { FC } from "react";
import styled from "styled-components";

const SectionHeaderStyled = styled(Section.Header)`
    padding: 8px 8px 12px;

    .SectionHeader--content {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        .SectionHeader--title {
        }

        .SectionHeader-rightButton {
            color: var(--tgui--button_color);
            background: transparent;
            border: none;

            padding: 5px 0 5px 24px;

            font-family: var(--tgui--font-family);
            font-weight: 500;
            font-size: 14px;
            line-height: 16px;

            &:active {
                color: var(--tgui--accent_text_color);
            }
        }
    }
`;

interface SectionHeaderProps {
    title: string;
    onViewAllClick: () => void;
}

const SectionHeader: FC<SectionHeaderProps> = ({ title, onViewAllClick }) => {
    return (
        <SectionHeaderStyled className="SectionHeader--header">
            <div className="SectionHeader--content">
                <span className="SectionHeader--title">{title}</span>
                <button className="SectionHeader-rightButton" onClick={onViewAllClick}>
                    View all
                </button>
            </div>
        </SectionHeaderStyled>
    );
};

export default SectionHeader;
