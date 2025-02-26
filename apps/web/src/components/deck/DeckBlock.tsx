import React, { FC, useMemo } from "react";
import styled from "styled-components";
import { DeckSchema } from "../../features/types/deck.types";
import CircularProgress from "../Feedback/CircularProgress/CircularProgress";
import SVGIcon from "../SVGIcon/SVGIcon";
import { Avatar } from "@telegram-apps/telegram-ui";

interface DeckBlockProps {
    deck: DeckSchema;
    showAuthor?: boolean;
    onClick?: (deck: DeckSchema) => void;
}

const DeckBlockStyled = styled.div`
    padding: 12px 16px;
    font-family: var(--app-font-family);
    color: var(--tgui--text_color);
    background: var(--app-deck-bg-color);
    border-radius: 18px;

    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;

    .deck-info {
        display: flex;
        flex-direction: column;
        gap: 6px;
        user-select: none;

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

        .deck-footer {
            margin-top: 4px;
            display: flex;
            gap: 12px;

            .deck-author {
                display: flex;
                align-items: center;
                gap: 4px;
                font-size: 12px;
                color: var(--app-subtitle-text-color);
            }

            .indicators {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .indicator {
                font-size: 14px;
                color: var(--app-subtitle-text-color);
                display: flex;
                gap: 4px;
                font-size: 13px;
                font-weight: 500;

                .indicator-icon {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                &#cards-count {
                    color: var(--app-secondary-text-color);
                }
            }
        }
    }

    &:hover {
        cursor: pointer;
    }

    &:active {
        opacity: 0.8;
    }
`;

const DeckBlock: FC<DeckBlockProps> = ({ deck, onClick, showAuthor = false }) => {
    const remindCount = deck.progress
        ? deck.progress.cardsToLearnCount + deck.progress.cardsToReviewCount
        : 0;
    const progressValue = deck.progress ? (1 - remindCount / (deck.cardsCount || 1)) * 100 : 0;

    const remindIndicatorColor =
        remindCount > 0 ? "var(--app-accent-yellow)" : "var(--app-secondary-text-color)";

    return (
        <DeckBlockStyled className="deck-block" onClick={() => onClick?.(deck)}>
            <div className="deck-info">
                <div className="deck-title">{deck.title}</div>

                {deck.description && <div className="deck-description">{deck.description}</div>}

                <div className="deck-footer">
                    {showAuthor && deck.author && (
                        <div className="deck-author">
                            <Avatar size={20} src={deck.author.photoUrl} />
                            <span>{deck.author.firstName || deck.author.username}</span>
                        </div>
                    )}
                    <div className="indicators">
                        <div id="cards-count" className="indicator">
                            <div className="indicator-icon">
                                <SVGIcon id="cards" />
                            </div>
                            {deck.cardsCount ?? "-"}
                        </div>
                        {remindCount > 0 && (
                            <div
                                id="remind-count"
                                className="indicator"
                                style={{ color: remindIndicatorColor }}
                            >
                                <div className="indicator-icon">
                                    <SVGIcon id="remind-cards" />
                                </div>
                                {remindCount}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {progressValue > 0 && progressValue < 100 && (
                <CircularProgress size={deck.description ? "large" : "medium"} progress={progressValue} />
            )}
        </DeckBlockStyled>
    );
};
export default DeckBlock;
