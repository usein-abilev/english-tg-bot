import React, { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Button, List, Section } from "@telegram-apps/telegram-ui";
import { useQuery } from "@tanstack/react-query";
import { createUserQuery } from "../../features/api/user";
import { ROUTES } from "../../constants/routes";
import { DeckListBlock } from "../../components/deck";
import { DeckSchema } from "../../features/types/deck.types";
import SectionHeader from "../../components/SectionHeader/SectionHeader";
import SVGIcon from "../../components/icons/SVGIcon";

const ListStyled = styled(List)`
    padding: 0;

    .greeting-title {
        font-size: 32px;
        line-height: 35px;
        font-weight: 500;
        padding: 24px 0 0 28px;
    }
`;

const DeckSectionStyled = styled.div`
    padding: 0 16px;

    .decks-header-content {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
`;

/**
 * MiniApp Main Screen
 */
export default function Home() {
    const navigate = useNavigate();
    const { data: userResult } = useQuery(createUserQuery());

    const handleViewAllDecks = () => {};

    const handleDeckClick = (deck: DeckSchema) => {
        navigate(ROUTES.DECKS_REVIEW.replace(":id", String(deck.id)), { state: { deck } });
    };

    return (
        <ListStyled>
            <div className="greeting-title">Hello, {userResult?.user.firstName}!</div>
            <DeckSectionStyled>
                <SectionHeader title="My decks" onViewAllClick={handleViewAllDecks} />
                {userResult?.decks && (
                    <DeckListBlock decks={userResult.decks} onDeckClick={handleDeckClick} />
                )}
            </DeckSectionStyled>
        </ListStyled>
    );
}
