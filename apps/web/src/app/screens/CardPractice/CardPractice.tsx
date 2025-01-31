import React, { FC } from "react";
import { CardSchema } from "../../../features/types/deck.types";
import styled from "styled-components";
import { Button } from "@telegram-apps/telegram-ui";
import { useLocation } from "react-router-dom";

const CardPracticeStyled = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 24px;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;

    font-family: var(--tgui--font-family);

    .title {
        font-size: 24px;
        line-height: 26px;
    }

    .card {
        width: 100%;
        height: 80%;
        perspective: 1000px;
        cursor: pointer;
    }

    .card-inner {
        width: 100%;
        height: 100%;
        position: relative;
        transition: transform 0.3s ease-in-out;
        transform-style: preserve-3d;
    }

    .flipped .card-inner {
        transform: rotateY(180deg);
    }

    .card-front,
    .card-back {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;

        backface-visibility: hidden;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        font-size: 22px;
        line-height: 24px;
        min-height: 120px;
        padding: 24px;
        box-sizing: border-box;
        text-align: center;
        border-radius: 12px;
        background: var(--tgui--bg_color);
    }

    .card-front {
    }

    .card-back {
        transform: rotateY(180deg);
    }

    .vote-caption {
        margin-top: 32px;
        font-size: 16px;
        line-height: 18px;
        text-align: center;
        color: var(--tgui--secondary_hint_color);
    }

    .card-controls {
        margin-top: 16px;
        display: flex;
        width: 100%;
        justify-content: space-between;
        gap: 12px;

        button {
            width: 100%;
        }
    }
`;

interface CardPracticeProps {}

const CardPractice: FC<CardPracticeProps> = () => {
    const location = useLocation();
    const cards = location.state?.cards || [];
    const [cardIndex, setCardIndex] = React.useState(0);
    const [flipped, setFlipped] = React.useState(false);
    const [card, setCard] = React.useState<CardSchema | null>(cards[0]);

    const nextCard = () => {
        if (cardIndex < cards.length - 1) {
            const index = cardIndex + 1;
            setCardIndex(index);
            setCard(cards[index]);
            setFlipped(false);
        }
    };

    return (
        <CardPracticeStyled className="CardPractice-container">
            {card ? (
                <>
                    <div className={`card ${flipped ? "flipped" : ""}`} onClick={() => setFlipped(!flipped)}>
                        <div className="card-inner">
                            <div className="card-front">
                                <div className="card-term">{card.term}</div>
                                <div className="card-center-text">{card.description}</div>
                            </div>
                            <div className="card-back">
                                <div className="card-center-text">{card.definition}</div>
                            </div>
                        </div>
                    </div>
                    <div className="vote-caption">How well do you know this term?</div>
                    <div className="card-controls">
                        <Button size="m" mode="bezeled">
                            Don&apos;t know
                        </Button>
                        <Button size="m" mode="bezeled" onClick={() => nextCard()}>
                            Know
                        </Button>
                    </div>
                </>
            ) : (
                <p>Not cards for practice</p>
            )}
        </CardPracticeStyled>
    );
};

export default CardPractice;
