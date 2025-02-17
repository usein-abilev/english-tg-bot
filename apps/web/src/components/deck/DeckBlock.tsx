import React, { FC, useMemo } from "react";
import styled from "styled-components";
import { DeckSchema } from "../../features/types/deck.types";
import { Progress } from "@telegram-apps/telegram-ui";

interface DeckBlockProps {
    deck: DeckSchema;
    onClick?: (deck: DeckSchema) => void;
}

const DeckBlockStyled = styled.div`
    padding: 12px 16px;
    font-family: var(--app-font-family);
    color: var(--tgui--text_color);
    background: var(--app-deck-bg-color);
    border-radius: 18px;

    display: flex;
    flex-direction: column;
    gap: 6px;

    .deck-title {
        font-style: normal;
        font-weight: 500;
        font-size: 20px;
        line-height: 23px;
    }

    .deck-description {
        opacity: 0.5;
        font-size: 12px;
        line-height: 15px;
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
        opacity: 0.8;
    }
`;

const DeckBlock: FC<DeckBlockProps> = ({ deck, onClick }) => {
    const progressValue = useMemo(() => {
        if (!deck.progress?.cardsCount) return 0;
        const learn = deck.progress.cardsToLearnCount + deck.progress.cardsToReviewCount;
        return (1 - learn / deck.progress.cardsCount) * 100;
    }, [deck]);

    return (
        <DeckBlockStyled className="deck-block" onClick={() => onClick?.(deck)}>
            <div className="deck-title">{deck.title}</div>

            {deck.description && <div className="deck-description">{deck.description}</div>}

            {progressValue > 0 && (
                <div className="deck-progress">
                    <Progress value={progressValue} className="deck-progress-bar" />
                </div>
            )}
        </DeckBlockStyled>
    );
};
export default DeckBlock;
