import { useInfiniteQuery } from "@tanstack/react-query";
import { useState, useMemo, useCallback } from "react";
import { getCardsToPracticeQuery } from "../features/api/practice";

const usePracticeCards = (deckId?: number) => {
    const limit = 50;

    const {
        data: paginatedResponse,
        fetchNextPage,
        hasNextPage,
        isFetching: isLoading,
    } = useInfiniteQuery(
        getCardsToPracticeQuery({
            deckId,
            limit,
        }),
    );

    const [cardIndex, setCardIndex] = useState(0);

    const { cards, total, page } = useMemo(() => {
        if (!paginatedResponse?.pages.length) return { cards: [], total: 0, page: 0 };

        const lastPage = paginatedResponse.pages[paginatedResponse.pages.length - 1];
        const items = paginatedResponse.pages.flatMap((page) => page.items);

        return {
            cards: items,
            total: lastPage.pagination.total,
            page: lastPage.pagination.page,
        };
    }, [paginatedResponse]);

    const currentCardPage = Math.floor(cardIndex / limit);
    const card = cards[cardIndex];

    const nextCard = useCallback(() => {
        if (cardIndex >= cards.length - 1) return;

        if (cards.length - 1 - cardIndex < 5 && currentCardPage === page && hasNextPage) {
            fetchNextPage();
        }

        setCardIndex((prevIndex) => prevIndex + 1);
    }, [cardIndex, cards.length, currentCardPage, page, hasNextPage, fetchNextPage]);

    return {
        cardIndex,
        card,
        cards,
        total,
        nextCard,
        isLoading,
    };
};

export default usePracticeCards;
