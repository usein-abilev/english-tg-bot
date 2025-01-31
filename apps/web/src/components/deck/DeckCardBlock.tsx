import React, { FC } from "react";
import { CardSchema } from "../../features/types/deck.types";
import styled from "styled-components";

const StyledDeckCardBlock = styled.div`
    background: var(--tgui--bg_color);
    padding: 12px 16px;
    border-radius: 12px;
    font-family: var(--tgui--font-family);

    .card-term {
        font-size: var(--tgui--title3--font_size);
        line-height: var(--tgui--title3--line_height);
    }

    .card-description {
        margin-top: 8px;
        color: var(--tgui--subtitle_text_color);
    }
`;

interface DeckCardBlockProps {
    card: CardSchema;
    onCardClick: (card: CardSchema) => void;
}

const DeckCardBlock: FC<DeckCardBlockProps> = ({ card, onCardClick }) => {
    return (
        <StyledDeckCardBlock>
            <div className="card-term">{card.term}</div>
            <div className="card-description">{card.definition}</div>
        </StyledDeckCardBlock>
    );
};

export default DeckCardBlock;
