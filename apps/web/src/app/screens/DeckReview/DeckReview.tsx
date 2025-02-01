import { Button, InlineButtons } from "@telegram-apps/telegram-ui";
import React, { useMemo } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { ROUTES } from "../../../constants/routes";
import { AddCardModal, DeckCardBlock } from "../../../components/deck";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getDecksCardsInfinityQuery } from "../../../features/api/cards";
import CenterInfoFallback from "../../../components/CenterInfoFallback/CenterInfoFallback";
// import { InlineButtonsItem } from "@telegram-apps/telegram-ui/dist/components/Blocks/InlineButtons/components/InlineButtonsItem/InlineButtonsItem";
// import { IconAdd } from "../../../components/icons";

const StyledDeckReview = styled.div`
    overflow: hidden;
    height: 100%;
    display: flex;
    flex-direction: column;

    .deck-header {
        background: #222;
        color: #fff;
        padding: 16px;

        .deck-info {
            text-align: center;
            font-family: var(--tgui--font-family);

            .deck-title {
                font-size: var(--tgui--title2--font_size);
                line-height: var(--tgui--title2--line_height);
            }

            .deck-description {
                margin-top: 8px;
                color: var(--tgui--subtitle_text_color);
            }
        }

        .deck-controls {
            margin-top: 16px;
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 8px;
        }
    }

    .deck-main {
        margin-top: 16px;
        margin-bottom: 16px;
        padding: 0 8px;

        height: 100%;
        overflow-y: auto;

        .cards-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
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

    const handlePractice = () => {
        navigate(ROUTES.DECK_PRACTICE.replace(":id", deck.id), {
            state: { cards },
        });
    };

    if (!location.state || !id) {
        return <Navigate to={ROUTES.DECKS} replace />;
    }

    return (
        <StyledDeckReview className="deck-container">
            <AddCardModal deckId={deck.id} open={addCardModal} setOpen={setAddCardModal} />
            <div className="deck-header">
                <div className="deck-info">
                    <div className="deck-title">{deck.title}</div>
                    <div className="deck-description">{deck.description}</div>
                </div>
                <div className="deck-controls">
                    <Button className="deck-control" size="m" mode="bezeled" onClick={handlePractice}>
                        Practice
                    </Button>
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
            </div>
            <main className="deck-main">
                {cards.length > 0 ? (
                    <div className="cards-list">
                        {cards.map((item) => {
                            return <DeckCardBlock key={item.id} card={item} onCardClick={() => {}} />;
                        })}
                    </div>
                ) : (
                    <CenterInfoFallback text="No cards in this deck. Please add one" />
                )}
            </main>
        </StyledDeckReview>
    );
}

export default DeckReview;
