import { Progress, Spinner } from "@telegram-apps/telegram-ui";
import React, { useEffect, useMemo } from "react";
import { CardSchema } from "../../../features/types/deck.types";
import Button from "../../../components/Button/Button";
import CardFlipper from "../../../components/Card/CardFlipper";

export interface CardPracticeRateProps {
    card: CardSchema;
    cardIndex: number;
    total: number;
    loading: boolean;
    onRate: (grade: number) => void;
}

function CardPracticeRate({ loading, cardIndex, card, total, onRate }: CardPracticeRateProps) {
    const [showAnswer, setShowAnswer] = React.useState(false);

    const progress = useMemo(() => {
        return Math.floor((cardIndex / total) * 100);
    }, [cardIndex, total]);

    const rateCard = (grade: number) => {
        onRate(grade);
    };

    useEffect(() => {
        setShowAnswer(false);
    }, [card]);

    if (loading) {
        return <Spinner size="l" />;
    }

    return (
        <>
            <header>
                <div className="title">{card.deck?.title}</div>
                <div className="progress">
                    <Progress value={progress} />
                    <div className="progress-description">
                        {cardIndex + 1}/{total}
                    </div>
                </div>
            </header>

            <CardFlipper card={card} parentFlipped={showAnswer} clickable={false} />

            <div className="vote-caption">How well do you know this term?</div>
            <div className="card-controls">
                {showAnswer ? (
                    <>
                        <Button
                            disabled={loading}
                            size="m"
                            mode="bezeled"
                            onClick={() => rateCard(0)}
                            style={{
                                background: "var(--app-red-button-color)",
                                color: "var(--app-red-button-text-color)",
                            }}
                        >
                            Bad
                        </Button>
                        <Button
                            disabled={loading}
                            size="m"
                            mode="bezeled"
                            onClick={() => rateCard(1)}
                            style={{
                                background: "var(--app-orange-button-color)",
                                color: "var(--app-orange-button-text-color)",
                            }}
                        >
                            Hard
                        </Button>
                        <Button
                            disabled={loading}
                            size="m"
                            mode="bezeled"
                            onClick={() => rateCard(2)}
                            style={{
                                background: "var(--app-green-button-color)",
                                color: "var(--app-green-button-text-color)",
                            }}
                        >
                            Know it
                        </Button>
                    </>
                ) : (
                    <Button
                        disabled={loading}
                        size="m"
                        mode="bezeled"
                        onClick={() => setShowAnswer(true)}
                        style={{
                            background: "var(--app-primary-button-color)",
                            color: "var(--app-blue-button-text-color)",
                        }}
                    >
                        Show answer
                    </Button>
                )}
            </div>
        </>
    );
}

export default CardPracticeRate;
