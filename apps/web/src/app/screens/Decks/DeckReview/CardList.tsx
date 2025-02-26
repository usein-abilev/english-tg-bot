import React, { useEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import { getDecksCardsInfinityQuery } from "../../../../features/api/cards";
import { useInfiniteQuery } from "@tanstack/react-query";
import { DeckSchema } from "../../../../features/types/deck.types";
import CardBlock from "../../../../components/Card/CardBlock";

const CardListContainer = styled.div`
    margin-top: 16px;
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

interface CardListProps {
    deck: DeckSchema;
    fallback?: React.ReactNode;
}

function CardList({ deck, fallback }: CardListProps) {
    const {
        data: cardsPagesResult,
        hasNextPage,
        fetchNextPage,
    } = useInfiniteQuery(
        getDecksCardsInfinityQuery({
            deckId: deck.id,
            limit: 25,
            page: 1,
        }),
    );

    const cards = useMemo(() => {
        if (!cardsPagesResult) return [];
        return cardsPagesResult.pages.flatMap((page) => page.items);
    }, [cardsPagesResult]);

    const observerRef = useRef(null);

    useEffect(() => {
        if (!observerRef.current || !hasNextPage) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                fetchNextPage();
            }
        });

        observer.observe(observerRef.current);

        return () => observer.disconnect();
    }, [hasNextPage, fetchNextPage]);

    if (!cards.length && !hasNextPage) {
        return fallback || null;
    }

    return (
        <CardListContainer className="cards-list">
            {cards.map((item) => {
                return <CardBlock key={item.id} card={item} onCardClick={() => {}} />;
            })}
            <div ref={observerRef} style={{ height: 1 }} />
        </CardListContainer>
    );
}

export default CardList;
