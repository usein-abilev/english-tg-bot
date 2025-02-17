import { Progress, Spinner } from "@telegram-apps/telegram-ui";
import React, { useMemo } from "react";
import { CardSchema } from "../../../features/types/deck.types";
import Button from "../../../components/Button/Button";
import { AnimatePresence, motion } from "framer-motion";
import SVGIcon from "../../../components/icons/SVGIcon";

export interface CardPracticeRateProps {
    card: CardSchema;
    cardIndex: number;
    total: number;
    loading: boolean;
    onRate: (grade: number) => void;
}

function CardPracticeRate({ loading, cardIndex, card, total, onRate }: CardPracticeRateProps) {
    const [flipped, setFlipped] = React.useState(false);

    const isDefinitionScrollable = useMemo(() => {
        if (!card.definition) return false;
        return card.definition.split("\n").length > 3 || card.definition.length > 200;
    }, [card.definition]);

    const progress = useMemo(() => {
        return Math.floor((cardIndex / total) * 100);
    }, [cardIndex, total]);

    const rateCard = (grade: number) => {
        setFlipped(false);
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
            <AnimatePresence mode="wait">
                <motion.div
                    key={card.id}
                    className={`card ${flipped ? "flipped" : ""}`}
                    onClick={() => setFlipped(!flipped)}
                    initial={{ opacity: 0, x: 50, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{
                        opacity: 0,
                        x: -80,
                        scale: 0.95,
                    }}
                    transition={{ duration: 0.1, ease: "easeInOut" }}
                >
                    <div className="card-inner">
                        <div className="card-front">
                            <div className="card-term center-text">{card.term}</div>
                            {card.description && <div className="center-text">{card.description}</div>}
                        </div>
                        <div className="card-back">
                            <div className="definition-header">
                                <div
                                    className="header-icon"
                                    onClick={(event) => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        console.log("Translate requested", card);
                                    }}
                                >
                                    <SVGIcon id="translate" />
                                </div>
                            </div>
                            <div
                                className={`definition-content ${isDefinitionScrollable ? "scrollable" : ""}`}
                            >
                                {card.definition}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
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
