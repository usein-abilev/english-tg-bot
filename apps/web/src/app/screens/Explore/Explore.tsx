import React from "react";
import styled from "styled-components";
import SectionEmptyContent from "../../../components/Section/SectionEmptyContent";
import { DeckListBlock } from "../../../components/Deck";
import { useInfiniteQuery } from "@tanstack/react-query";
import { findDecksInfinityQuery } from "../../../features/api/decks";
import { DeckSchema } from "../../../features/types/deck.types";
import { Pagination } from "@telegram-apps/telegram-ui";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";

const Container = styled.div`
    padding: var(--app-screen-padding);
`;

interface ExploreProps {}

function Explore(props: ExploreProps) {
    const navigate = useNavigate();

    const {
        data: decksPagesResult,
        hasNextPage,
        fetchNextPage,
        isLoading,
    } = useInfiniteQuery(
        findDecksInfinityQuery({
            limit: 10,
            page: 0,
        }),
    );

    const decks = decksPagesResult?.pages?.flatMap((page) => page.items) as DeckSchema[];

    const handleDeckClick = (deck: DeckSchema) => {
        navigate(ROUTES.DECKS_REVIEW.replace(":id", String(deck.id)));
    };

    return (
        <Container>
            <h1>Public Decks</h1>

            {!!decksPagesResult?.pages?.length ? (
                <DeckListBlock decks={decks} onDeckClick={handleDeckClick} />
            ) : (
                <SectionEmptyContent>No public decks</SectionEmptyContent>
            )}
        </Container>
    );
}

export default Explore;
