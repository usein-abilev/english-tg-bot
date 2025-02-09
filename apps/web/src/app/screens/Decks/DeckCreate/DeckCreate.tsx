import React, { FC } from "react";
import styled from "styled-components";
import { useCreateDeckMutation } from "../../../../features/api/decks";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../../constants/routes";
import Button from "../../../../components/Button/Button";
import { Input } from "@telegram-apps/telegram-ui";
import { FormLayout } from "../../../../components/Layouts";

const FullSizeButton = styled(Button)`
    width: 100%;
`;

function DeckCreate() {
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
                navigate(ROUTES.DECKS_REVIEW.replace(":id", String(data.id)));
            },
        });
    };

    return (
        <FormLayout
            header="Create a new deck"
            footer={
                <FullSizeButton loading={createDeckMutation.isPending} onClick={handleCreateDeck}>
                    Create
                </FullSizeButton>
            }
        >
            <Input
                disabled={createDeckMutation.isPending}
                value={form.title}
                header="title"
                status={createDeckMutation.isError ? "error" : "default"}
                onChange={(e) =>
                    setForm({
                        ...form,
                        title: e.target.value,
                    })
                }
                placeholder="E.g. English Phrasal Verbs"
            />
            <Input
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
        </FormLayout>
    );
}

export default DeckCreate;
