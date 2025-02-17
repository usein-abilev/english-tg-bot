import { Modal, List, Section, Input, Textarea } from "@telegram-apps/telegram-ui";
import React, { FC, useCallback, useEffect } from "react";
import { useCreateCardMutation } from "../../features/api/cards";
import Button from "../Button/Button";
import styled from "styled-components";

const ModalStyled = styled(Modal)`
    .form-input {
        margin-bottom: 12px;

        .input-label {
            color: var(--app-section-text-color);
            font-size: 16px;
            font-weight: 500;
            margin-bottom: 6px;
        }
    }
`;

interface AddCardModalProps {
    deckId: number;
    open: boolean;
    setOpen: (open: boolean) => void;
}

const AddCardModal: FC<AddCardModalProps> = ({ deckId, open, setOpen }) => {
    const [form, setForm] = React.useState({
        term: "",
        definition: "",
        description: "",
    });

    const createMutation = useCreateCardMutation();
    const loading = createMutation.isPending;

    const handleAddCard = () => {
        if (loading) return;
        const object = {
            ...form,
            deckId,
        };
        createMutation.mutate(object, {
            onSuccess: (data) => {
                console.log("Card added:", data);
                setOpen(false);
            },
            onError: (error) => console.log("Error happened:", error),
        });
    };

    useEffect(() => {
        setForm({
            term: "",
            definition: "",
            description: "",
        });
    }, [open]);

    return (
        <ModalStyled
            open={open}
            header={<Modal.Header>Add card</Modal.Header>}
            onOpenChange={setOpen}
            style={{ background: "var(--app-bg-color)" }}
        >
            <List style={{ height: "80vh" }}>
                <div className="form-input">
                    <div className="input-label">Front side</div>
                    <Input
                        disabled={loading}
                        value={form.term}
                        placeholder="E.g. pick up"
                        onChange={(event) => setForm((form) => ({ ...form, term: event.target.value }))}
                    />
                </div>
                <div className="form-input">
                    <div className="input-label">Back side</div>
                    <Textarea
                        disabled={loading}
                        value={form.definition}
                        placeholder="E.g. to lift something off the ground"
                        onChange={(event) => setForm((form) => ({ ...form, definition: event.target.value }))}
                    />
                </div>
                <Button
                    loading={loading}
                    mode="white"
                    size="m"
                    style={{ width: "100%" }}
                    onClick={handleAddCard}
                >
                    Add
                </Button>
            </List>
        </ModalStyled>
    );
};

export default AddCardModal;
