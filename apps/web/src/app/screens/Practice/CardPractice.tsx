import React, { FC, useRef, useState } from "react";
import { useBlocker, useLocation, useParams } from "react-router-dom";
import { useFinalizePracticeMutation, useRateCardBatchMutation } from "../../../features/api/practice";
import CardPracticeRate from "./CardPracticeRate";
import PracticeContainer from "./PracticeContainer";
import { Spinner } from "@telegram-apps/telegram-ui";
import useDeferredRateCard from "../../../hooks/useDeferredRateCard";
import { useQueryClient } from "@tanstack/react-query";
import { USER_QUERY_KEY } from "../../../features/api/user";
import { DECKS_QUERY_KEY } from "../../../features/api/decks";
import usePracticeCards from "../../../hooks/usePracticeCards";
import PracticeSessionEnd, { PracticeSessionResultProp } from "./PracticeSessionEnd";

interface CardPracticeProps {}

const CardPractice: FC<CardPracticeProps> = () => {
    const location = useLocation();
    const state = (location.state as { deckId?: number }) || {};

    const practiceSessionStateRef = useRef({
        isDirty: false,
        isSessionEnded: false,
    });

    useBlocker(({ currentLocation, nextLocation }) => {
        const { current: practiceSessionState } = practiceSessionStateRef;
        if (!practiceSessionState.isDirty || practiceSessionState.isSessionEnded) {
            return false;
        }
        const accept = confirm("Are you sure you want to leave the practice session?");
        console.log("[Card Practice]: Blocker", currentLocation, nextLocation);
        return !accept; // block navigation
    });

    const queryClient = useQueryClient();

    const { cardIndex, card, total, nextCard, isLoading } = usePracticeCards(state.deckId);
    const [showResults, setShowResults] = React.useState(false);

    const practiceResultRef = useRef<PracticeSessionResultProp>({
        finalizeResult: undefined,
        grades: [],
        affectedDecks: [],
    });

    const affectedDeckIds = useRef<number[]>([]);

    const finalizePracticeMutation = useFinalizePracticeMutation();
    const rateCardBatchMutation = useRateCardBatchMutation();

    const onPracticeEnd = async () => {
        console.log("On practice end", practiceSessionStateRef);
        queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });

        if (affectedDeckIds.current.length > 0) {
            const result = await finalizePracticeMutation.mutateAsync({
                deckIds: affectedDeckIds.current,
            });
            console.log("[CardPractice]: Finalize response", result);
            practiceResultRef.current.finalizeResult = result;

            affectedDeckIds.current.forEach((deckId) => {
                queryClient.invalidateQueries({ queryKey: [DECKS_QUERY_KEY, deckId] });
            });
        }

        setShowResults(true);
    };

    const deferredRate = useDeferredRateCard((ratings) => {
        rateCardBatchMutation.mutate(
            { cards: ratings },
            {
                onSuccess: async (rates) => {
                    console.log("CardPractice card rated:", rates, practiceSessionStateRef);

                    if (practiceSessionStateRef.current.isSessionEnded) {
                        // Practice session has ended
                        await onPracticeEnd();
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

        if (practiceSessionStateRef.current.isSessionEnded) {
            console.error("[CardPractice]: Session has ended.");
            return;
        }

        practiceSessionStateRef.current.isDirty = true;

        if (!affectedDeckIds.current.includes(card.deckId)) {
            affectedDeckIds.current.push(card.deckId);
            practiceResultRef.current.affectedDecks.push({
                id: card.deckId,
                title: card.deck?.title || "",
                description: card.deck?.description || "",
            });
        }

        practiceResultRef.current.grades.push({
            cardId: card.id,
            grade,
        });

        if (cardIndex >= total - 1) {
            console.log("[CardPractice]: Flushing ratings");
            practiceSessionStateRef.current.isSessionEnded = true;
            deferredRate.addRate(card.id, grade);
            deferredRate.flush(true);
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
                <PracticeSessionEnd result={practiceResultRef.current} />
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
