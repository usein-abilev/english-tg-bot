import { useCallback, useEffect, useRef } from "react";

const DEBOUNCE_TIME = 5_000;

interface RateCard {
    cardId: number;
    grade: number;
}

/**
 * Hook to rate cards with a debounce mechanism
 */
const useDeferredRateCard = (rateCards: (ratings: RateCard[]) => void | Promise<void>) => {
    const pendingRatings = useRef<RateCard[]>([]);
    const timeoutId = useRef<NodeJS.Timeout | null>(null);
    const isPending = pendingRatings.current.length > 0;
    const locked = useRef(true);

    const flush = useCallback(
        (force = false) => {
            if (pendingRatings.current.length === 0) return;
            if (!force && locked.current) return;

            locked.current = true;

            const ratingsToSend = [...pendingRatings.current];
            pendingRatings.current = [];

            console.log("[useDeferredRateCard]: Sending ratings", ratingsToSend);
            rateCards(ratingsToSend);
        },
        [rateCards],
    );

    const addRate = useCallback(
        (cardId: number, grade: number) => {
            pendingRatings.current.push({ cardId, grade });

            flush();

            if (timeoutId.current) {
                clearTimeout(timeoutId.current);
            }

            timeoutId.current = setTimeout(() => {
                locked.current = false;
            }, DEBOUNCE_TIME);
        },
        [flush],
    );

    return { flush, addRate, isPending };
};

export default useDeferredRateCard;
