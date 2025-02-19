import { Progress, Spinner } from "@telegram-apps/telegram-ui";
import React, { useMemo } from "react";
import { CardSchema } from "../../../features/types/deck.types";
import Button from "../../../components/Button/Button";
import { AnimatePresence, motion } from "framer-motion";
import SVGIcon from "../../../components/icons/SVGIcon";
import CardFlipper from "../../../components/Card/CardFlipper";

export interface CardPracticeRateProps {
    card: CardSchema;
    cardIndex: number;
    total: number;
    loading: boolean;
    onRate: (grade: number) => void;
}

function CardPracticeRate({ loading, cardIndex, card, total, onRate }: CardPracticeRateProps) {
    const progress = useMemo(() => {
        return Math.floor((cardIndex / total) * 100);
    }, [cardIndex, total]);

    const rateCard = (grade: number) => {
        onRate(grade);
    };

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

            <CardFlipper card={card} />

            <div className="vote-caption">How well do you know this term?</div>
            <div className="card-controls">
                <Button
                    disabled={loading}
                    size="m"
                    mode="bezeled"
                    onClick={() => rateCard(0)}
                    style={{
                        background: "var(--app-red-button-color",
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
                        background: "var(--app-orange-button-color",
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
                        background: "var(--app-green-button-color",
                        color: "var(--app-green-button-text-color)",
                    }}
                >
                    Know it
                </Button>
            </div>
        </>
    );
}

export default CardPracticeRate;
