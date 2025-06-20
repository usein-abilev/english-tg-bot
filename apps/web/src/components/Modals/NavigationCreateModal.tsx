import { List, Modal } from "@telegram-apps/telegram-ui";
import React, { FC, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ROUTES } from "../../constants/routes";

const CreateModalContainer = styled(List)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-bottom: 24px;
    font-family: var(--app-font-family);

    .create-option {
        background: rgba(0, 122, 255, 0.1);
        padding: 6px;
        border: none;
        text-align: center;
        color: #e8e8e8;
        border-radius: 8px;
        width: 100%;
        max-width: 318px;

        .option-title {
            font-weight: 600;
            font-size: 18px;
            line-height: 20px;
            color: var(--tgui--accent_text_color);
        }
        .option-description {
            margin-top: 6px;
            font-size: 12px;
            line-height: 14px;
            color: #e8e8e8;
        }

        &:hover {
            background: rgba(0, 122, 255, 0.2);
        }
    }
`;

interface NavigationCreateModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

const NavigationCreateModal: FC<NavigationCreateModalProps> = ({ open, setOpen }) => {
    const navigate = useNavigate();

    const handleCreateDeck = useCallback(() => {
        setOpen(false);
        navigate(ROUTES.DECK_CREATE);
    }, [navigate, setOpen]);

    const handleCreateFolder = useCallback(() => {
        console.log("Creating folder is not implemented yet");
    }, []);

    return (
        <Modal
            open={open}
            header={<Modal.Header>What do you want to create?</Modal.Header>}
            onOpenChange={setOpen}
        >
            <CreateModalContainer>
                <button className="create-option" onClick={handleCreateDeck}>
                    <div className="option-title">Deck</div>
                    <div className="option-description">A collection of cards</div>
                </button>
                <button className="create-option" onClick={handleCreateFolder}>
                    <div className="option-title">Folder</div>
                    <div className="option-description">A collection of decks</div>
                </button>
            </CreateModalContainer>
        </Modal>
    );
};

export default NavigationCreateModal;
