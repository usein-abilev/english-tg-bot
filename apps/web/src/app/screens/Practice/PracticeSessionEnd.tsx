import { FC, useMemo } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import ConfettiExplosion from "../../../components/Animations/ConfettiExplosion";
import Counter from "../../../components/Animations/Counter";
import { FinalizePracticeResult } from "../../../features/api/practice";
import { DeckSchema } from "../../../features/types/deck.types";

export interface PracticeSessionResultProp {
    grades: { cardId: number; grade: number }[];
    affectedDecks: Pick<DeckSchema, "id" | "title" | "description">[];
    finalizeResult?: FinalizePracticeResult;
}

interface PracticeSessionEndProps {
    result: PracticeSessionResultProp;
}

const StyledContainer = styled.div`
    --practice-padding-horizontal: 36px;
    --practice-padding-vertical: 42px;
    --practice-title-size: 32px;
    --practice-title-weight: 500;
    --practice-counter-number-size: 32px;
    --practice-counter-description-size: 14px;
    --practice-deck-title-size: 24px;

    @media (max-width: 400px) {
        --practice-padding-horizontal: 24px;
        --practice-padding-vertical: 16px;
        --practice-title-size: 24px;
        --practice-counter-number-size: 24px;
        --practice-counter-description-size: 12px;
        --practice-deck-title-size: 18px;
    }

    width: 100%;
    height: 100%;
    position: relative;

    box-sizing: border-box;
    overflow: hidden;

    .title {
        padding: var(--practice-padding-vertical) var(--practice-padding-horizontal) 0
            var(--practice-padding-horizontal);
        max-width: 350px;
        font-size: var(--practice-title-size);
        font-weight: var(--practice-title-weight);
        color: var(--app-title-text-color);
    }

    .scrollable-content {
        padding: 0 var(--practice-padding-horizontal);
        margin-top: 24px;
        overflow-y: auto;
        height: 100%;
    }

    .counters {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 16px;

        .counter-block {
            flex: 1 150px;
            position: relative;
            padding: 16px;
            box-sizing: border-box;
            border-radius: 18px;
            border: 2px solid var(--app-secondary-bg-color);
            overflow: hidden;

            #easy-counter-glow,
            #hard-counter-glow,
            #bad-counter-glow {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 0;
                background: transparent;
                border-radius: 18px;
            }

            #easy-counter-glow {
                box-shadow: 0 0 100px 10px color-mix(in srgb, var(--app-accent-green) 35%, transparent);
            }

            #hard-counter-glow {
                box-shadow: 0 0 100px 10px color-mix(in srgb, var(--app-accent-yellow) 35%, transparent);
            }

            #bad-counter-glow {
                box-shadow: 0 0 100px 10px
                    color-mix(in srgb, var(--app-red-button-text-color) 35%, transparent);
            }

            .counter-number {
                font-size: var(--practice-counter-number-size);
                font-weight: 500;
                color: var(--app-title-text-color);
            }

            .counter-description {
                font-size: var(--practice-counter-description-size);
                color: var(--app-subtitle-text-color);
                margin-top: 8px;
            }

            @media (max-width: 375px) {
                flex: 1 100px;
                padding: 12px;
            }
        }
    }

    .decks-list {
        margin-top: 24px;
        display: flex;
        flex-direction: column;
        gap: 16px;

        .decks-stats-block {
            background: var(--app-deck-bg-color);
            padding: 16px;
            border-radius: 18px;

            .deck-title {
                font-size: var(--practice-deck-title-size);
                font-weight: 500;
                color: var(--app-title-text-color);
            }

            .deck-stats {
                margin-top: 12px;
                display: flex;
                justify-content: space-between;
                text-align: center;

                .deck-feature {
                    padding: 8px;
                    border-radius: 12px;

                    .feature-value {
                        font-size: 24px;
                        font-weight: 500;
                    }

                    .feature-caption {
                        font-size: 14px;
                        color: var(--app-subtitle-text-color);
                    }
                }
            }
        }
    }
`;

const PracticeSessionEnd: FC<PracticeSessionEndProps> = ({ result }) => {
    console.log("Practice session end:", result);
    const stats = useMemo(() => {
        const grades = result.grades.map((item) => item.grade);
        const total = grades.length;
        const metrics = {
            total,
            easy: 0,
            hard: 0,
            bad: 0,
        };

        grades.forEach((r) => {
            if (r === 2) metrics.easy++;
            if (r === 1) metrics.hard++;
            if (r < 1) metrics.bad++;
        });

        return metrics;
    }, [result.grades]);

    const decksWithStats = useMemo(() => {
        const { finalizeResult } = result;

        if (!finalizeResult) return [];

        const items = result.affectedDecks.map((deck) => {
            const stats = finalizeResult.find((r) => r.deckId === deck.id);
            return {
                ...deck,
                stats: stats?.improvement,
            };
        });

        return items.filter((i) => i.stats);
    }, [result]);

    return (
        <StyledContainer>
            <ConfettiExplosion />
            <motion.div
                initial={{ opacity: 0, x: 0, scale: 0.5 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.1, type: "spring", stiffness: 100, easing: "easeIn" }}
                style={{ width: "100%", height: "100%" }}
            >
                <div className="title">Practice session completed 🎉</div>
                <div className="scrollable-content">
                    <motion.div className="counters">
                        <motion.div
                            className="counter-block"
                            id="easy-counter"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="counter-number">
                                <Counter from={0} to={stats.easy} />
                            </div>
                            <div className="counter-description">Number of cards you know</div>
                            <div id="easy-counter-glow" />
                        </motion.div>
                        <motion.div
                            className="counter-block"
                            id="hard-counter"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1, duration: 0.5 }}
                        >
                            <div className="counter-number">
                                <Counter from={0} to={stats.hard} />
                            </div>
                            <div className="counter-description">Number of cards you are unsure about</div>
                            <div id="hard-counter-glow" />
                        </motion.div>
                        <motion.div
                            className="counter-block"
                            id="bad-counter"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            <div className="counter-number">
                                <Counter delay={0.2} from={0} to={stats.bad} />
                            </div>
                            <div className="counter-description">
                                Number of cards that require additional repetition
                            </div>
                            <div id="bad-counter-glow" />
                        </motion.div>
                    </motion.div>

                    <div className="decks-list">
                        {decksWithStats.map((deck) => (
                            <div key={deck.id} className="decks-stats-block">
                                <div className="deck-title">{deck.title}</div>
                                <div className="deck-stats">
                                    <div className="deck-feature" id="deck-stats-reviewed">
                                        <div className="feature-value">
                                            +{Math.ceil(deck.stats!.learnedCardsCount)}
                                        </div>
                                        <div className="feature-caption">Learned</div>
                                    </div>
                                    <div className="deck-feature" id="deck-stats-learned">
                                        <div className="feature-value">
                                            +{Math.ceil(deck.stats!.averageGradePercent * 100)}%
                                        </div>
                                        <div className="feature-caption">Average Rating</div>
                                    </div>
                                    <div className="deck-feature" id="deck-stats-struggled">
                                        <div className="feature-value">{deck.stats!.difficultCardsCount}</div>
                                        <div className="feature-caption">Difficult Cards</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </StyledContainer>
    );
};

export default PracticeSessionEnd;
