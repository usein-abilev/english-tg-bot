import React, { FC, useRef } from "react";
import { useBlocker, useLocation, useParams } from "react-router-dom";
import { useRateCardBatchMutation } from "../../../features/api/practice";
import CardPracticeRate from "./CardPracticeRate";
import PracticeContainer from "./PracticeContainer";
import { Spinner } from "@telegram-apps/telegram-ui";
import useDeferredRateCard from "../../../hooks/useDeferredRateCard";
import { useQueryClient } from "@tanstack/react-query";
import { USER_QUERY_KEY } from "../../../features/api/user";
import { DECKS_QUERY_KEY } from "../../../features/api/decks";
import usePracticeCards from "../../../hooks/usePracticeCards";
import PracticeSessionEnd from "./PracticeSessionEnd";

interface CardPracticeProps {}

const CardPractice: FC<CardPracticeProps> = () => {
    const location = useLocation();
    const state = (location.state as { deckId?: number }) || {};

    const blocker = useBlocker(({ currentLocation, nextLocation }) => {
        const accept = confirm("Are you sure you want to leave the practice session?");
        console.log("[Card Practice]: Blocker", currentLocation, nextLocation);
        return !accept; // block navigation
    });

    const queryClient = useQueryClient();

    const { cardIndex, card, total, nextCard, isLoading } = usePracticeCards(state.deckId);
    const isSessionEnded = useRef(false);
    const [showResults, setShowResults] = React.useState(false);
    const [practiceResults, setPracticeResults] = React.useState<number[]>([]);

    const rateCardBatchMutation = useRateCardBatchMutation();
    const deferredRate = useDeferredRateCard((ratings) => {
        rateCardBatchMutation.mutate(
            { cards: ratings },
            {
                onSuccess: (rates) => {
                    console.log("CardPractice card rated:", rates, isSessionEnded);

                    if (isSessionEnded.current) {
                        queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
                        if (state.deckId) {
                            queryClient.invalidateQueries({ queryKey: [DECKS_QUERY_KEY, state.deckId] });
                        }
                        isSessionEnded.current = false;
                    }
                },
            },
        );
    });

    const rateCard = (grade: number) => {
        if (!card) {
            console.error("[CardPractice]: No card available to rate.");
            return;
        }

        if (isSessionEnded.current) {
            console.error("[CardPractice]: Session has ended.");
            return;
        }

        setPracticeResults((prev) => [...prev, grade]);

        if (cardIndex >= total - 1) {
            console.log("[CardPractice]: Flushing ratings");
            isSessionEnded.current = true;
            deferredRate.addRate(card.id, grade);
            deferredRate.flush(true);
            setShowResults(true);
        } else {
            nextCard();
            deferredRate.addRate(card.id, grade);
        }
    };

    if (!card) {
        if (isLoading) {
            return (
                <PracticeContainer>
                    <Spinner size="l" />
                </PracticeContainer>
            );
        }
        return <PracticeContainer>No cards for practice</PracticeContainer>;
    }

    return (
        <PracticeContainer>
            {showResults ? (
                <PracticeSessionEnd results={practiceResults} />
            ) : (
                <CardPracticeRate
                    loading={isLoading}
                    card={card}
                    cardIndex={cardIndex}
                    total={total}
                    onRate={rateCard}
                />
            )}
        </PracticeContainer>
    );
};

export default CardPractice;
