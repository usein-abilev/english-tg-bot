import React, { useEffect, useMemo, useRef } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { replaceRouteParams, ROUTES } from "../../../../constants/routes";
import { useInfiniteQuery, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getDecksCardsInfinityQuery } from "../../../../features/api/cards";
import CenterInfoFallback from "../../../../components/CenterInfoFallback/CenterInfoFallback";
import { getDeckByIdQuery, useDeleteDeckMutation } from "../../../../features/api/decks";
import CardBlock from "../../../../components/Card/CardBlock";
import { createUserQuery } from "../../../../features/api/user";
import Button from "../../../../components/Button/Button";
import SVGIcon from "../../../../components/icons/SVGIcon";
import DropdownMenu from "../../../../components/Modals/DropdownMenu/DropdownMenu";
import DropdownMenuItem from "../../../../components/Modals/DropdownMenu/DropdownMenuItem";
import CardFormModal from "../../../../components/Card/CardFormModal";

const StyledDeckReview = styled.div`
    overflow: hidden;
    height: 100%;
    display: flex;
    flex-direction: column;
    font-family: var(--app-font-family);

    .deck-header {
        background: linear-gradient(105.16deg, #161e2a 0%, #1f2632 100%);
        padding: 20px;

        .deck-info {
            .deck-title {
                font-size: 24px;
                line-height: 27px;
                font-weight: 500;
                color: var(--app-title-text-color);
            }

            .deck-description {
                margin-top: 8px;
                color: var(--app-subtitle-text-color);
            }
        }

        .deck-progress {
            display: flex;
            gap: 16px;
            margin-top: 8px;
            font-weight: 500;

            .indicator {
                font-size: 14px;
                line-height: 16px;
                color: var(--app-subtitle-text-color);
                display: flex;
                gap: 4px;

                .indicator-icon {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                &#cards-count {
                    color: var(--app-accent-blue);
                    stroke: var(--app-accent-blue);
                }
                &#completed-count {
                    color: var(--app-accent-green);
                }
                &#remind-count {
                    color: var(--app-accent-yellow);
                }
            }
        }

        .deck-header-bottom {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 16px;
            height: 43px;

            .left-block {
                display: flex;
                flex-direction: column;
                gap: 4px;

                .last-update-at {
                    font-size: 12px;
                    line-height: 15px;
                    font-weight: 400;
                    color: var(--app-subtitle-text-color);
                }
            }

            .author-block {
                display: flex;
                align-items: center;
                gap: 6px;

                .author-image {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    overflow: hidden;

                    span {
                        background: var(--app-secondary-button-color);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        text-align: center;
                        font-size: 12px;
                        height: 100%;
                        height: 100%;
                    }

                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                }

                .author-name {
                    font-size: 12px;
                    line-height: 15px;
                    color: var(--app-title-text-color);
                    font-weight: 500;
                }
            }

            .deck-controls {
                display: flex;
                gap: 8px;
            }
        }
    }

    .deck-main {
        padding: 0 8px;

        height: 100%;
        overflow-y: auto;

        .cards-list {
            margin-top: 16px;
            margin-bottom: 16px;
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

    const { data: userData } = useSuspenseQuery(createUserQuery());
    const { data: deck } = useSuspenseQuery(getDeckByIdQuery(Number(id), location.state?.deck));
    const deleteDeckMutation = useDeleteDeckMutation();

    const isAuthor = deck?.authorId === userData.user.id;

    const {
        data: cardsPagesResult,
        hasNextPage,
        fetchNextPage,
    } = useInfiniteQuery(
        getDecksCardsInfinityQuery({
            deckId: deck?.id,
            limit: 10,
            page: 1,
        }),
    );

    const cards = useMemo(() => {
        if (!cardsPagesResult) return [];
        return cardsPagesResult.pages.flatMap((page) => page.items);
    }, [cardsPagesResult]);

    const deckMenuDetailsRef = useRef(null);
    const [deckMenuOpen, setDeckMenuOpen] = React.useState(false);

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

    const [addCardModal, setAddCardModal] = React.useState(false);

    const handleAddCard = () => {
        setAddCardModal(true);
    };

    const handlePractice = () => {
        navigate(ROUTES.PRACTICE, { state: { deckId: deck.id } });
    };

    const handleEditDeck = () => {
        navigate(replaceRouteParams(ROUTES.DECK_EDIT, { id: deck.id }));
    };

    const handleDeleteDeck = () => {
        Telegram.WebApp.showConfirm("Are you sure you want to delete this deck?", (ok) => {
            if (!ok) return;
            deleteDeckMutation.mutate(deck.id, {
                onError: (error) => {
                    console.log("Error while deleting deck", error);
                },
                onSuccess: () => {
                    navigate(-1);
                },
            });
        });
    };

    const stats = useMemo(() => {
        if (!deck?.progress) return { total: 0, completed: 0, remind: 0 };
        const total = deck.progress.cardsCount || 0;
        const remind = deck.progress.cardsToReviewCount + deck.progress.cardsToLearnCount;
        const completed = total - remind;
        return { total, completed, remind };
    }, [deck]);

    return (
        <StyledDeckReview className="deck-layout">
            <CardFormModal deckId={deck?.id} open={addCardModal} setOpen={setAddCardModal} />
            <DropdownMenu
                buttonRef={deckMenuDetailsRef}
                isOpen={deckMenuOpen}
                onClose={() => setDeckMenuOpen(false)}
            >
                {isAuthor && (
                    <>
                        <DropdownMenuItem onClick={handleAddCard}>Add card</DropdownMenuItem>
                        <DropdownMenuItem onClick={handleEditDeck}>Edit</DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={handleDeleteDeck}
                            style={{ color: "var(--app-red-button-text-color)" }}
                        >
                            Delete
                        </DropdownMenuItem>
                    </>
                )}
                {!isAuthor && <DropdownMenuItem onClick={() => {}}>Make clone</DropdownMenuItem>}
            </DropdownMenu>

            <div className="deck-header">
                <div className="deck-info">
                    <div className="deck-title">{deck?.title}</div>
                    <div className="deck-description">{deck?.description}</div>
                </div>
                <div className="deck-progress">
                    <div id="cards-count" className="indicator">
                        <div className="indicator-icon">
                            <SVGIcon id="cards" />
                        </div>
                        {cardsPagesResult?.pages?.[0]?.pagination?.total || stats.total || 0}
                    </div>
                    <div id="completed-count" className="indicator">
                        <div className="indicator-icon">
                            <SVGIcon id="completed-cards" />
                        </div>
                        {stats.completed}
                    </div>
                    <div id="remind-count" className="indicator">
                        <div className="indicator-icon">
                            <SVGIcon id="remind-cards" />
                        </div>
                        {stats.remind}
                    </div>
                </div>
                <div className="deck-header-bottom">
                    <div className="left-block">
                        <div className="author-block">
                            <div className="author-image">
                                {userData.user.photoUrl ? (
                                    <img src={userData.user.photoUrl} alt="author" />
                                ) : (
                                    <span>{userData.user.firstName.charAt(0).toUpperCase()}</span>
                                )}
                            </div>
                            <div className="author-name">{userData.user.firstName}</div>
                        </div>
                        <div className="last-update-at">
                            Last update: {new Date(deck?.updatedAt).toLocaleDateString("uk")}
                        </div>
                    </div>
                    <div className="deck-controls">
                        <Button className="deck-control" size="m" mode="filled" onClick={handlePractice}>
                            {!isAuthor ? <SVGIcon id="play-line" /> : "Start"}
                        </Button>
                        {!isAuthor && (
                            <Button
                                className="deck-control"
                                size="m"
                                mode="bezeled"
                                onClick={() => {
                                    console.log("Add card to favorite not implemented yet");
                                }}
                            >
                                <SVGIcon id="plus-line" />
                            </Button>
                        )}
                        <Button
                            elementRef={deckMenuDetailsRef}
                            className="deck-control"
                            size="m"
                            mode="bezeled"
                            onClick={() => setDeckMenuOpen(true)}
                        >
                            <SVGIcon id="three-dots" />
                        </Button>
                    </div>
                </div>
            </div>

            <main className="deck-main">
                {cards.length > 0 ? (
                    <div className="cards-list">
                        {cards.map((item) => {
                            return <CardBlock key={item.id} card={item} onCardClick={() => {}} />;
                        })}
                        <div ref={observerRef} style={{ height: 1 }} />
                    </div>
                ) : (
                    <CenterInfoFallback text="No cards in this deck. Please add one" />
                )}
            </main>
        </StyledDeckReview>
    );
}

export default DeckReview;
