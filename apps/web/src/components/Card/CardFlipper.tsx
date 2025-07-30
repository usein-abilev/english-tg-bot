import React, { useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CardSchema } from "../../features/types/deck.types";
import SVGIcon from "../SVGIcon/SVGIcon";
import styled from "styled-components";

const CardContainer = styled.div`
    width: 100%;
    height: 100%;

    .card {
        width: 100%;
        height: calc(100% - 24px);
        perspective: 1000px;
        cursor: pointer;
    }

    .card-inner {
        width: 100%;
        height: 100%;
        position: relative;
        transition: transform 0.5s cubic-bezier(0.19, 1, 0.22, 1);
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
        box-sizing: border-box;
        white-space: pre-wrap;
        border-radius: 12px;
        color: var(--app-title-text-color);
        background: var(--app-card-bg-color);
    }

    .card-front {
        padding: 24px;
    }

    .card-back {
        font-size: 18px;
        line-height: 21px;
        color: var(--app-subtitle-text-color);
        transform: rotateY(180deg);

        position: relative;
        padding: 12px 16px;

        .definition-header {
            position: absolute;
            right: 16px;
            top: 12px;
            z-index: 101;

            display: flex;
            justify-content: flex-end;
            gap: 12px;

            .header-icon {
                width: 24px;
                height: 24px;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 50px;
                background: var(--app-secondary-button-color);
            }
        }

        .definition-content {
            z-index: 100;
            position: absolute;
            top: 0;
            padding: 24px;
            box-sizing: border-box;

            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            word-break: break-word;

            &.scrollable {
                overflow-y: auto;
            }
        }
    }

    .center-text {
        text-align: center;
    }
`;

interface CardFlipperProps extends React.HTMLAttributes<HTMLDivElement> {
    card: CardSchema;

    /**
     * Whether the card is clickable to flip
     */
    clickable?: boolean;

    /**
     * In case this card should be flipped by a parent component
     * (e.g. when showing results in a practice session)
     */
    parentFlipped?: boolean;
}

function CardFlipper({ card, clickable = true, parentFlipped = false, ...props }: CardFlipperProps) {
    const [flipped, setFlipped] = React.useState(false);

    const isDefinitionScrollable = useMemo(() => {
        if (!card.definition) return false;
        return card.definition.split("\n").length > 3 || card.definition.length > 200;
    }, [card.definition]);

    useEffect(() => {
        setFlipped(false);
    }, [card]);

    useEffect(() => {
        if (parentFlipped !== flipped) {
            setFlipped(parentFlipped);
        }
    }, [parentFlipped]);

    return (
        <CardContainer {...props}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={card.id}
                    className={`card ${flipped ? "flipped" : ""}`}
                    onClick={() => clickable && setFlipped(!flipped)}
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
                            {/* <div className="definition-header">
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
                            </div> */}
                            <div
                                className={`definition-content ${isDefinitionScrollable ? "scrollable" : ""}`}
                            >
                                {card.definition}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </CardContainer>
    );
}

export default CardFlipper;
