import { Button } from "@telegram-apps/telegram-ui";
import React, { useMemo } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { ROUTES } from "../../../constants/routes";
import { AddCardModal, DeckCardBlock } from "../../../components/deck";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getDecksCardsInfinityQuery } from "../../../features/api/cards";

const StyledDeckReview = styled.div`
    .deck-header {
        background: #222;
        color: #fff;
        padding: 24px;

        .deck-info {
            text-align: center;
            font-family: var(--tgui--font-family);

            .deck-title {
                font-size: var(--tgui--title1--font_size);
                line-height: var(--tgui--title1--line_height);
            }

            .deck-description {
                color: var(--tgui--subtitle_text_color);
            }
        }
        .deck-controls {
            display: flex;
            justify-content: center;
            gap: 1rem;
        }
    }

    .deck-main {
        margin-top: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 16px;

        height: 100%;
        overflow-y: auto;
        max-height: 480px;
    }
`;

function DeckReview() {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const [addCardModal, setAddCardModal] = React.useState(false);

    const deck = location.state?.deck || {
        id: -1,
        title: "",
        description: "",
    };
    const { data: cardsPagesResult } = useInfiniteQuery(
        getDecksCardsInfinityQuery({
            deckId: deck?.id,
            limit: 10,
            page: 1,
        }),
    );
    const cards = useMemo(() => {
        if (!cardsPagesResult) {
            return [];
        }
        return cardsPagesResult.pages.flatMap((page) => page.items);
    }, [cardsPagesResult]);

    const handleAddCard = () => {
        setAddCardModal(true);
    };

    if (!location.state || !id) {
        return <Navigate to={ROUTES.DECKS} replace />;
    }

    return (
        <StyledDeckReview className="deck-container">
            <AddCardModal deckId={deck.id} open={addCardModal} setOpen={setAddCardModal} />
            <header className="deck-header">
                <div className="deck-info">
                    <p className="deck-title">{deck.title}</p>
                    <p className="deck-description">{deck.description}</p>
                </div>
                <div className="deck-controls">
                    <Button className="deck-control" size="m" mode="bezeled" onClick={handleAddCard}>
                        Add
                    </Button>
                    <Button className="deck-control" size="m" mode="bezeled">
                        Edit
                    </Button>
                    <Button className="deck-control" size="m" mode="bezeled">
                        Delete
                    </Button>
                </div>
            </header>
            <main className="deck-main">
                {cards.map((item) => {
                    return <DeckCardBlock key={item.id} card={item} onCardClick={() => {}} />;
                })}
            </main>
        </StyledDeckReview>
    );
}

export default DeckReview;
