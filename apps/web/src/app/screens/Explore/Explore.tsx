import React from "react";
import styled from "styled-components";
import SectionEmptyContent from "../../../components/Section/SectionEmptyContent";
import { DeckListBlock } from "../../../components/Deck";
import { useInfiniteQuery } from "@tanstack/react-query";
import { findDecksInfinityQuery } from "../../../features/api/decks";
import { DeckSchema } from "../../../features/types/deck.types";
import { Input } from "@telegram-apps/telegram-ui";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";
import TitledPageLayout from "../../../components/Layouts/TitledPageLayout";
import SVGIcon from "../../../components/SVGIcon/SVGIcon";

const Container = styled.div`
    padding: 0 16px;

    .search-input {
        input::placeholder,
        svg {
            color: var(--app-secondary-text-color);
        }
    }

    .explore-content {
        margin-top: 12px;
    }
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
        <TitledPageLayout title="Explore">
            <Container>
                <Input className="search-input" placeholder="Search decks" before={<SVGIcon id="search" />} />
                <div className="explore-content">
                    {!!decksPagesResult?.pages?.length ? (
                        <DeckListBlock showAuthor decks={decks} onDeckClick={handleDeckClick} />
                    ) : (
                        <SectionEmptyContent>No public decks</SectionEmptyContent>
                    )}
                </div>
            </Container>
        </TitledPageLayout>
    );
}

export default Explore;
