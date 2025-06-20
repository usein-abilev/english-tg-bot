import React, { FC } from "react";
import { CardSchema } from "../../features/types/deck.types";
import styled from "styled-components";
import DropdownMenu from "../Modals/DropdownMenu/DropdownMenu";
import DropdownMenuItem from "../Modals/DropdownMenu/DropdownMenuItem";
import { useDeleteCardMutation } from "../../features/api/cards";
import { useNavigate } from "react-router-dom";
import { replaceRouteParams, ROUTES } from "../../constants/routes";
import SVGIcon from "../SVGIcon/SVGIcon";
import CardFormModal from "./CardFormModal";

const StyledCardBlock = styled.div`
    background: var(--app-card-bg-color);
    padding: 12px 16px;
    border-radius: 12px;
    font-family: var(--tgui--font-family);

    display: flex;
    justify-content: space-between;
    align-items: center;

    .card-term {
        font-size: 20px;
        line-height: 23px;
        font-weight: 500;
    }

    .card-description {
        margin-top: 8px;
        color: var(--app-subtitle-text-color);
        font-size: 14px;
        line-height: 17px;
        font-weight: 400;
    }

    .details-icon {
        cursor: pointer;
    }
`;

interface CardBlockProps {
    card: CardSchema;
    onCardClick: (card: CardSchema) => void;
}

const CardBlock: FC<CardBlockProps> = ({ card, onCardClick }) => {
    const detailsBtnRef = React.useRef<HTMLDivElement>(null);
    const [detailsMenuOpen, setDetailsMenuOpen] = React.useState(false);

    const [editModalOpen, setEditModalOpen] = React.useState(false);

    const navigate = useNavigate();
    const cardDeleteMutation = useDeleteCardMutation();

    const handleViewCard = () => {
        navigate(
            replaceRouteParams(ROUTES.DECK_CARD_REVIEW, {
                cardId: card.id,
                deckId: card.deckId,
            }),
            { state: card },
        );
    };

    const handleEditCard = () => {
        setEditModalOpen(true);
    };

    const handleDeleteCard = () => {
        setDetailsMenuOpen(false);
        window.Telegram.WebApp.showConfirm("Are you sure you want to delete this card?", (ok) => {
            if (!ok) return;
            cardDeleteMutation.mutate({
                cardId: card.id,
                deckId: card.deckId,
            });
        });
    };

    return (
        <StyledCardBlock>
            <CardFormModal card={card} deckId={card.deckId} open={editModalOpen} setOpen={setEditModalOpen} />

            <DropdownMenu
                buttonRef={detailsBtnRef}
                isOpen={detailsMenuOpen}
                onClose={() => setDetailsMenuOpen(false)}
            >
                <DropdownMenuItem onClick={handleViewCard}>View</DropdownMenuItem>
                <DropdownMenuItem onClick={handleEditCard}>Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={handleDeleteCard}>Delete</DropdownMenuItem>
            </DropdownMenu>

            <div className="info">
                <div className="card-term">{card.term}</div>
                <div className="card-description">{card.definition}</div>
            </div>
            <div className="details-icon">
                <div ref={detailsBtnRef} onClick={() => setDetailsMenuOpen(true)}>
                    <SVGIcon id="three-dots-horizontal" />
                </div>
            </div>
        </StyledCardBlock>
    );
};

export default CardBlock;
