import React, { FC } from "react";
import styled from "styled-components";
import { getDeckByIdQuery, useUpdateDeckMutation } from "../../../../features/api/decks";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../../../constants/routes";
import Button from "../../../../components/Button/Button";
import { Input } from "@telegram-apps/telegram-ui";
import FormLayout from "../../../../components/Layouts/FormLayout";
import { useSuspenseQuery } from "@tanstack/react-query";

const FullSizeButton = styled(Button)`
    width: 100%;
`;

const DeckEditFooter = styled.div`
    display: flex;
    gap: 8px;
`;

function DeckEdit() {
    const { id } = useParams<{ id: string }>();

    // const { data: userData } = useSuspenseQuery(createUserQuery());
    const updateDeckMutation = useUpdateDeckMutation();
    const { data: deck } = useSuspenseQuery(getDeckByIdQuery(Number(id)));

    const [form, setForm] = React.useState({
        title: deck.title || "",
        description: deck.description || "",
    });
    const navigate = useNavigate();

    const handleUpdateDeck = () => {
        if (updateDeckMutation.isPending) return;
        updateDeckMutation.mutate(
            { id: deck.id, ...form },
            {
                onError: (error) => console.log("Error happened:", error),
                onSuccess: (data) => {
                    console.log("[NewDeckForm]: Deck updated", data);
                    navigate(ROUTES.DECKS_REVIEW.replace(":id", String(deck.id)));
                },
            },
        );
    };

    return (
        <FormLayout
            header="Edit deck"
            footer={
                <DeckEditFooter>
                    <FullSizeButton
                        mode="outline"
                        disabled={updateDeckMutation.isPending}
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </FullSizeButton>
                    <FullSizeButton loading={updateDeckMutation.isPending} onClick={handleUpdateDeck}>
                        Save
                    </FullSizeButton>
                </DeckEditFooter>
            }
        >
            <Input
                disabled={updateDeckMutation.isPending}
                value={form.title}
                header="title"
                status={updateDeckMutation.isError ? "error" : "default"}
                onChange={(e) =>
                    setForm({
                        ...form,
                        title: e.target.value,
                    })
                }
                placeholder="E.g. English Phrasal Verbs"
            />
            <Input
                disabled={updateDeckMutation.isPending}
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

export default DeckEdit;
