import React from "react";
import styled from "styled-components";
import SectionEmptyContent from "../../../components/Section/SectionEmptyContent";
import { DeckBlock, DeckListBlock } from "../../../components/Deck";
import { useInfiniteQuery } from "@tanstack/react-query";
import { findDecksInfinityQuery } from "../../../features/api/decks";
import { DeckSchema } from "../../../features/types/deck.types";
import { Input, Spinner } from "@telegram-apps/telegram-ui";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";
import TitledPageLayout from "../../../components/Layouts/TitledPageLayout";
import SVGIcon from "../../../components/SVGIcon/SVGIcon";
import useDebounce from "../../../hooks/useDebounce";
import ContinuousList from "../../../components/ContinuousList/ContinuousList";

const Container = styled.div`
    padding: 0 16px;
    height: 100%;
    box-sizing: border-box;

    display: flex;
    flex-direction: column;

    .search-input {
        height: 48px;
        input::placeholder,
        svg {
            color: var(--app-secondary-text-color);
        }
    }

    .explore-content {
        height: 100%;
        margin-top: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
`;

interface ExploreProps {}

function Explore(props: ExploreProps) {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = React.useState("");

    const {
        data: decksPagesResult,
        hasNextPage,
        fetchNextPage,
        isLoading,
        isFetching,
        isFetchingNextPage,
    } = useInfiniteQuery(
        findDecksInfinityQuery({
            limit: 25,
            page: 0,
            query: searchQuery,
        }),
    );

    const handleSearch = useDebounce((value: string) => {
        console.log("Search for decks", value);
        setSearchQuery(value);
    }, 500);

    const decks = decksPagesResult?.pages?.flatMap((page) => page.items) as DeckSchema[];

    const handleDeckClick = (deck: DeckSchema) => {
        navigate(ROUTES.DECKS_REVIEW.replace(":id", String(deck.id)));
    };

    return (
        <TitledPageLayout title="Explore">
            <Container>
                <Input
                    className="search-input"
                    placeholder="Search decks"
                    before={<SVGIcon id="search" />}
                    after={isFetching && !isFetchingNextPage ? <Spinner size="s" /> : undefined}
                    onChange={(event) => {
                        handleSearch(event.target.value);
                    }}
                />
                <div className="explore-content">
                    {isLoading ? (
                        <Spinner size="m" />
                    ) : (
                        <ContinuousList
                            isFetchingNextPage={isFetchingNextPage}
                            hasNextPage={hasNextPage}
                            fetchNextPage={fetchNextPage}
                            style={{ gap: "10px", width: "100%", height: "100%", overflowY: "auto" }}
                        >
                            {decks.map((deck) => (
                                <DeckBlock key={deck.id} deck={deck} showAuthor onClick={handleDeckClick} />
                            ))}
                        </ContinuousList>
                    )}
                </div>
            </Container>
        </TitledPageLayout>
    );
}

export default Explore;
