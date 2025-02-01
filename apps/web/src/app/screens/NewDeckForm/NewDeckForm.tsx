import { Button, Input, LargeTitle, List, Section, Textarea, Title } from "@telegram-apps/telegram-ui";
import React from "react";
import styled from "styled-components";
import { useCreateDeckMutation } from "../../../features/api/decks";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";

const FullSizeButton = styled(Button)`
    width: 100%;
`;

function NewDeckForm(props) {
    const [form, setForm] = React.useState({
        title: "",
        description: "",
    });
    const createDeckMutation = useCreateDeckMutation();
    const navigate = useNavigate();

    const handleCreateDeck = () => {
        if (createDeckMutation.isPending) return;
        createDeckMutation.mutate(form, {
            onError: (error) => console.log("Error happened:", error),
            onSuccess: (data) => {
                console.log("[NewDeckForm]: Deck created", data);
                navigate(`${ROUTES.DECK_REVIEW}/${data.deck.id}`);
            },
        });
    };

    return (
        <List>
            <LargeTitle plain={true} style={{ textAlign: "center" }}>
                Create a new deck
            </LargeTitle>
            <Section header="Deck Title">
                <Input
                    disabled={createDeckMutation.isPending}
                    value={form.title}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            title: e.target.value,
                        })
                    }
                    placeholder="E.g. English Phrasal Verbs"
                />
            </Section>
            <Section header="Deck Description">
                <Textarea
                    disabled={createDeckMutation.isPending}
                    value={form.description}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            description: e.target.value,
                        })
                    }
                    placeholder="E.g. A deck to learn English phrasal verbs"
                />
            </Section>
            <FullSizeButton loading={createDeckMutation.isPending} onClick={handleCreateDeck}>
                Create
            </FullSizeButton>
        </List>
    );
}

export default NewDeckForm;
