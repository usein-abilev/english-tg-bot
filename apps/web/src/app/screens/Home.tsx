import React, { FC } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Button, List, Section } from "@telegram-apps/telegram-ui";
import { useQuery } from "@tanstack/react-query";
import { userQuery } from "../../features/api/user";
import { ROUTES } from "../../constants/routes";
import { DeckListBlock } from "../../components/deck";
import { DeckSchema } from "../../features/types/deck.types";
import SectionHeader from "../../components/SectionHeader/SectionHeader";

const ListStyled = styled(List)``;

const DeckSectionStyled = styled.div`
    .decks-header-content {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .decks-footer {
        display: flex;
        justify-content: center;
    }
`;

/**
 * MiniApp Main Screen
 */
export default function Home() {
    const navigate = useNavigate();
    const [addModalOpen, setAddModalOpen] = React.useState(false);
    const { data: userResult } = useQuery(userQuery());

    const handleAddDeck = () => {
        navigate(ROUTES.NEW_DECK);
    };

    const handleViewAllDecks = () => {};

    const handleDeckClick = (deck: DeckSchema) => {
        navigate(ROUTES.DECK_REVIEW.replace(":id", String(deck.id)), { state: { deck } });
    };

    return (
        <ListStyled>
            <DeckSectionStyled>
                <SectionHeader title="My decks" onViewAllClick={handleViewAllDecks} />
                {userResult?.decks && (
                    <DeckListBlock decks={userResult.decks} onDeckClick={handleDeckClick} />
                )}
                <Section.Footer className="decks-footer">
                    <Button onClick={handleAddDeck} size="m" mode="bezeled">
                        Add Deck
                    </Button>
                </Section.Footer>
            </DeckSectionStyled>
        </ListStyled>
    );
}
