import React, { FC } from "react";
import styled from "styled-components";
import { DeckSchema } from "../../features/types/deck.types";
import { Divider, Progress } from "@telegram-apps/telegram-ui";

interface DeckBlockProps {
    deck: DeckSchema;
    onClick?: (deck: DeckSchema) => void;
}

const DeckBlockStyled = styled.div`
    padding: 12px;
    font-family: var(--tgui--font-family);
    color: var(-- tgui--text_color);
    background: var(--tgui--bg_color);
    border-radius: 12px;

    display: flex;
    flex-direction: column;
    gap: 6px;

    .deck-title {
        font-style: normal;
        font-weight: 600;
        font-size: 16px;
        line-height: 18px;
    }

    .deck-description {
        opacity: 0.5;
        font-size: 14px;
        line-height: 16px;
    }

    .deck-progress {
        margin-top: 4px;
        background: rgba(41, 144, 255, 0.2);
        border-radius: 2px;
    }

    &:hover {
        cursor: pointer;
    }

    &:active {
        background: var(--tgui--tertiary_bg_color);
    }
`;

const DeckBlock: FC<DeckBlockProps> = ({ deck, onClick }) => {
    return (
        <DeckBlockStyled className="deck-block" onClick={() => onClick?.(deck)}>
            <div className="deck-title">{deck.title}</div>

            <Divider />

            <div className="deck-description">{deck.description}</div>

            <div className="deck-progress">
                <Progress value={28} className="deck-progress-bar" />
            </div>
        </DeckBlockStyled>
    );
};
export default DeckBlock;
