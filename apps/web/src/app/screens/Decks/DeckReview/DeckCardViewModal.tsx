import React, { useMemo } from "react";
import styled from "styled-components";
import CardFlipper from "../../../../components/Card/CardFlipper";
import { DeckSchema } from "../../../../features/types/deck.types";
import { Spinner } from "@telegram-apps/telegram-ui";
import usePracticeCards from "../../../../hooks/usePracticeCards";
import Button from "../../../../components/Button/Button";
import SVGIcon from "../../../../components/SVGIcon/SVGIcon";

const ModalOverlayContent = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    header {
        text-align: center;

        .title {
            font-size: 24px;
            line-height: 27px;
            font-weight: 500;
        }

        .progress {
            margin-top: 12px;

            .progress-description {
                margin-top: 4px;
                font-style: normal;
                font-weight: 600;
                font-size: 16px;
                line-height: 19px;
                color: #96a0aa;
            }
        }

        margin-bottom: 24px;
    }

    .card-controls {
        margin-top: 24px;
        width: 100%;
    }
`;

interface DeckCardViewModalProps {
    deck: DeckSchema;
    onClose: () => void;
}

function DeckCardViewModal({ deck, onClose }: DeckCardViewModalProps) {
    const { cardIndex, card, total, nextCard, isLoading } = usePracticeCards(deck.id);

    const isLast = useMemo(() => cardIndex >= total - 1, [cardIndex, total]);

    const handleNextCard = () => {
        if (isLast) {
            onClose();
            return;
        }
        nextCard();
    };

    return (
        <ModalOverlayContent>
            {!card && isLoading ? (
                <Spinner size="l" />
            ) : (
                <>
                    <header className="modal-header">
                        <div className="title">{deck.title}</div>
                        <div className="progress">
                            <div className="progress-description">
                                {Math.min(total, cardIndex + 1)}/{total}
                            </div>
                        </div>
                    </header>
                    {card ? (
                        <CardFlipper card={card} className="card-flipper" />
                    ) : (
                        <div
                            className="info-block"
                            style={{
                                fontFamily: "var(--app-font-family)",
                                fontSize: "16px",
                                color: "var(--app-secondary-text-color)",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <div className="info-block-title">No cards to review</div>
                        </div>
                    )}
                    <div className="card-controls">
                        <Button size="m" style={{ width: "100%" }} onClick={handleNextCard}>
                            {isLast ? "Close" : "Next card"}
                        </Button>
                    </div>
                </>
            )}
        </ModalOverlayContent>
    );
}

export default DeckCardViewModal;
