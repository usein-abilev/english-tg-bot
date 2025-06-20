import React, { useMemo } from "react";
import styled from "styled-components";
import SectionEmptyContent from "../../../components/Section/SectionEmptyContent";
import { SegmentedControl } from "@telegram-apps/telegram-ui";
import { SegmentedControlItem } from "@telegram-apps/telegram-ui/dist/components/Navigation/SegmentedControl/components/SegmentedControlItem/SegmentedControlItem";
import { DeckListBlock } from "../../../components/Deck";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createUserQuery } from "../../../features/api/user";
import TitledPageLayout from "../../../components/Layouts/TitledPageLayout";
import { ROUTES } from "../../../constants/routes";
import { useNavigate } from "react-router-dom";
import { DeckSchema } from "../../../features/types/deck.types";

const LibraryContainer = styled.div`
    height: 100%;
    overflow: hidden;

    .navbar {
        position: relative;
        z-index: 1;
        padding: 0 16px 8px 16px;
    }

    .tab-content {
        padding: 8px 16px;
        height: calc(100% - 56px);
        overflow-y: auto;
    }
`;

interface LibraryProps {}

function Library(props: LibraryProps) {
    const navigate = useNavigate();

    const [selectedTab, setSelectedTab] = React.useState<"my" | "favorite">("my");
    const { data: userData } = useSuspenseQuery(createUserQuery());

    const userDeckTabs = useMemo(() => {
        const userDecks = userData.decks.filter((deck) => deck.authorId === userData.user.id);
        const favoriteDecks = userData.decks.filter((deck) => deck.authorId !== userData.user.id);
        return {
            my: userDecks,
            favorite: favoriteDecks,
        };
    }, [userData]);

    const onDeckClick = (deck: DeckSchema) => {
        navigate(ROUTES.DECKS_REVIEW.replace(":id", String(deck.id)));
    };

    return (
        <TitledPageLayout title="Library">
            <LibraryContainer>
                <div className="navbar">
                    <SegmentedControl>
                        <SegmentedControlItem
                            selected={selectedTab === "my"}
                            onClick={() => setSelectedTab("my")}
                        >
                            My Decks
                        </SegmentedControlItem>
                        <SegmentedControlItem
                            selected={selectedTab === "favorite"}
                            onClick={() => setSelectedTab("favorite")}
                        >
                            Favorite
                        </SegmentedControlItem>
                    </SegmentedControl>
                </div>

                <div className="tab-content">
                    {selectedTab === "my" && (
                        <DeckListBlock
                            decks={userDeckTabs.my}
                            onDeckClick={onDeckClick}
                            fallback={
                                <SectionEmptyContent style={{ marginTop: "12px" }}>
                                    <p>Library is empty</p>
                                    <p>Please create a deck or add a deck from the explore section</p>
                                </SectionEmptyContent>
                            }
                        />
                    )}
                    {selectedTab === "favorite" && (
                        <DeckListBlock
                            decks={userDeckTabs.favorite}
                            showAuthor
                            onDeckClick={onDeckClick}
                            fallback={
                                <SectionEmptyContent style={{ marginTop: "12px" }}>
                                    <p>Library is empty</p>
                                    <p>Please create a deck or add a deck from the explore section</p>
                                </SectionEmptyContent>
                            }
                        />
                    )}
                </div>
            </LibraryContainer>
        </TitledPageLayout>
    );
}

export default Library;
