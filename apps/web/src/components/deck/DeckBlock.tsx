import React, { FC } from "react";
import styled from "styled-components";
import { DeckSchema } from "../../features/types/deck.types";

interface DeckBlockProps {
    deck: DeckSchema;
    onClick?: (deck: DeckSchema) => void;
}

const DeckBlockStyled = styled.div`
    padding: 12px;
    font-family: var(--tgui--font-family);
    color: var(--tgui--text_color);
    background: var(--tgui--bg_color);
    border-radius: 12px;

    .deck-title {
        font-weight: 500;
    }

    .deck-description {
        opacity: 0.5;
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
            <div className="deck-description">{deck.description}</div>
        </DeckBlockStyled>
    );
};
export default DeckBlock;
