import { Modal, List, Section, Input, Textarea, Button } from "@telegram-apps/telegram-ui";
import React, { FC, useCallback, useEffect } from "react";
import { useCreateCardMutation } from "../../features/api/cards";

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
        <Modal open={open} header={<Modal.Header>Add card</Modal.Header>} onOpenChange={setOpen}>
            <List>
                <Section header="Card Front Side">
                    <Input
                        disabled={loading}
                        value={form.term}
                        placeholder="E.g. pick up"
                        onChange={(event) => setForm((form) => ({ ...form, term: event.target.value }))}
                    />
                </Section>
                <Section header="Card Back Side">
                    <Textarea
                        disabled={loading}
                        value={form.definition}
                        placeholder="E.g. to lift something off the ground"
                        onChange={(event) => setForm((form) => ({ ...form, definition: event.target.value }))}
                    />
                </Section>
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
        </Modal>
    );
};

export default AddCardModal;
