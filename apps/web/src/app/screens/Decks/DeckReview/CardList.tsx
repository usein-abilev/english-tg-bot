import React, { useEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import { getDecksCardsInfinityQuery } from "../../../../features/api/cards";
import { useInfiniteQuery } from "@tanstack/react-query";
import { DeckSchema } from "../../../../features/types/deck.types";
import CardBlock from "../../../../components/Card/CardBlock";
import ContinuousList from "../../../../components/ContinuousList/ContinuousList";

const CardListContainer = styled(ContinuousList)`
    margin-top: 16px;
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

interface CardListProps {
    deck: DeckSchema;
}

function CardList({ deck }: CardListProps) {
    const {
        data: cardsPagesResult,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
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

    if (!cards.length && !hasNextPage) {
        return (
            <div
                className="info-block"
                style={{
                    fontFamily: "var(--app-font-family)",
                    fontSize: "16px",
                    color: "var(--app-secondary-text-color)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    userSelect: "none",
                }}
            >
                No cards in this deck. Please add one
            </div>
        );
    }

    return (
        <CardListContainer
            className="cards-list"
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
        >
            {cards.map((item) => {
                return <CardBlock key={item.id} card={item} onCardClick={() => {}} />;
            })}
        </CardListContainer>
    );
}

export default CardList;
