import { Section } from "@telegram-apps/telegram-ui";
import React, { FC } from "react";
import styled from "styled-components";

const SectionHeaderStyled = styled(Section.Header)`
    padding: 0 6px;
    padding-bottom: 4px;

    .SectionHeader--content {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        user-select: none;

        .SectionHeader--title {
            font-family: var(--app-font-family);
            font-weight: 500;
            font-size: 12px;
            line-height: 15px;
            color: var(--app-section-text-color);
        }

        .SectionHeader-rightButton {
            color: var(--app-link-color);
            background: transparent;
            border: none;
            cursor: pointer;

            padding: 5px 0 5px 24px;

            font-family: var(--app-font-family);
            font-weight: 500;
            font-size: 14px;
            line-height: 16px;

            &:active {
                opacity: 0.7;
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
