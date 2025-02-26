import React, { FC } from "react";
import styled from "styled-components";
import { DeckSchema } from "../../features/types/deck.types";
import DeckBlock from "./DeckBlock";

interface DeckListBlockProps {
    decks: DeckSchema[];
    showAuthor?: boolean;
    onDeckClick?: (deck: DeckSchema) => void;
}

const DeckListBlockStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const DeckListBlock: FC<DeckListBlockProps> = ({ decks, onDeckClick, showAuthor }) => {
    return (
        <DeckListBlockStyled className="decks-list">
            {decks.map((deck) => (
                <DeckBlock key={deck.id} deck={deck} showAuthor={showAuthor} onClick={onDeckClick} />
            ))}
        </DeckListBlockStyled>
    );
};

export default DeckListBlock;
