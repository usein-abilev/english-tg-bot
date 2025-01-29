import React, { FC } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Button, InlineButtons, List, Modal, Placeholder, Section } from "@telegram-apps/telegram-ui";
import { Icon24Chat } from "@telegram-apps/telegram-ui/dist/icons/24/chat";
import { ModalHeader } from "@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader";
import { useQuery } from "@tanstack/react-query";
import { userQuery } from "../../features/api/user";
import { ROUTES } from "../../constants/routes";
import { DeckListBlock } from "../../components/deck";

const ListStyled = styled(List)`
    background: transparent;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .footer {
        background: var(--tgui--bg_color);
        display: flex;
        justify-content: center;
        border-radius: 48px;
    }
`;

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
    const navigation = useNavigate();
    const [addModalOpen, setAddModalOpen] = React.useState(false);
    const { data: userResult } = useQuery(userQuery());

    const handleAddDeck = () => {
        navigation(ROUTES.NEW_DECK);
    };

    return (
        <ListStyled>
            <Modal
                header={<ModalHeader>Only iOS header</ModalHeader>}
                open={addModalOpen}
                onOpenChange={(open) => setAddModalOpen(open)}
            >
                <Placeholder description="Description" header="Title">
                    <img
                        alt="Telegram sticker"
                        src="https://xelene.me/telegram.gif"
                        style={{
                            display: "block",
                            height: "144px",
                            width: "144px",
                        }}
                    />
                </Placeholder>
            </Modal>
            <DeckSectionStyled>
                <Section.Header className="decks-header">
                    <div className="decks-header-content">
                        <span>My Decks</span>
                        <Button size="s" mode="plain">
                            View all
                        </Button>
                    </div>
                </Section.Header>
                {userResult?.decks && <DeckListBlock decks={userResult.decks} />}
                <Section.Footer className="decks-footer">
                    <Button onClick={handleAddDeck} size="m" mode="bezeled">
                        Add Deck
                    </Button>
                </Section.Footer>
            </DeckSectionStyled>
            <div className="footer">
                <InlineButtons.Item mode="plain" text="Home">
                    <Icon24Chat />
                </InlineButtons.Item>
                <InlineButtons.Item mode="plain" text="Add" onClick={() => setAddModalOpen(true)}>
                    <Icon24Chat />
                </InlineButtons.Item>
                <InlineButtons.Item mode="plain" text="Profile">
                    <Icon24Chat />
                </InlineButtons.Item>
            </div>
        </ListStyled>
    );
}
