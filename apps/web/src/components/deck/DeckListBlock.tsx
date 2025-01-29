import React, { FC } from "react";
import styled from "styled-components";
import { DeckSchema } from "../../features/types/deck.types";
import DeckBlock from "./DeckBlock";

interface DeckListBlockProps {
    decks: DeckSchema[];
    onDeckClick?: (deck: DeckSchema) => void;
}

const DeckListBlockStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const DeckListBlock: FC<DeckListBlockProps> = ({ decks, onDeckClick }) => {
    return (
        <DeckListBlockStyled className="decks-list">
            {decks.map((deck) => (
                <DeckBlock key={deck.id} deck={deck} onClick={onDeckClick} />
            ))}
        </DeckListBlockStyled>
    );
};

export default DeckListBlock;
