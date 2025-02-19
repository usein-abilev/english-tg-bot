import React, { FC, useEffect } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import styled from "styled-components";
import { Modal, List, Input, Textarea } from "@telegram-apps/telegram-ui";
import { useCreateCardMutation, useUpdateCardMutation } from "../../features/api/cards";
import { CardSchema } from "../../features/types/deck.types";
import Button from "../Button/Button";
import { Controller, useForm } from "react-hook-form";

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

interface CardFormModalProps {
    deckId: number;
    open: boolean;
    card?: CardSchema;
    setOpen: (open: boolean) => void;
}

const schema = yup
    .object({
        term: yup.string().trim().min(1, "Required").required("Required"),
        definition: yup.string().trim().min(1, "Required").required("Required"),
        description: yup.string().trim().optional(),
    })
    .required();

const CardFormModal: FC<CardFormModalProps> = ({ deckId, open, setOpen, card }) => {
    const isEditing = !!card;

    const {
        control,
        handleSubmit,
        reset,
        formState: { isDirty, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            term: card?.term || "",
            definition: card?.definition || "",
            description: card?.description || "",
        },
    });

    const createMutation = useCreateCardMutation();
    const updateMutation = useUpdateCardMutation();
    const loading = createMutation.isPending || updateMutation.isPending || isSubmitting;

    const onSubmit = async (data: any) => {
        if (loading) return;

        const payload = { ...data, deckId };

        const mutation = isEditing
            ? updateMutation.mutateAsync({ ...payload, id: card.id })
            : createMutation.mutateAsync(payload);

        try {
            const result = await mutation;
            console.log("Card changed:", isEditing, result);
            setOpen(false);
        } catch (error) {
            console.log("Error happened during card processing:", error);
        }
    };

    useEffect(() => {
        if (open) {
            reset();
        }
    }, [open, card, reset]);

    return (
        <ModalStyled
            open={open}
            header={<Modal.Header>{isEditing ? "Edit card" : "Add card"}</Modal.Header>}
            onOpenChange={setOpen}
            style={{ background: "var(--app-bg-color)" }}
        >
            <List style={{ height: "80vh" }}>
                <div className="form-input">
                    <div className="input-label">Front side</div>
                    <Controller
                        name="term"
                        control={control}
                        disabled={loading}
                        render={({ field }) => (
                            <Input
                                disabled={loading}
                                value={field.value}
                                placeholder="E.g. pick up"
                                onChange={(event) => field.onChange(event.target.value)}
                            />
                        )}
                    />
                </div>
                <div className="form-input">
                    <div className="input-label">Back side</div>
                    <Controller
                        name="definition"
                        control={control}
                        disabled={loading}
                        render={({ field }) => (
                            <Textarea
                                disabled={loading}
                                value={field.value}
                                placeholder="E.g. to lift something off the ground"
                                onChange={(event) => field.onChange(event.target.value)}
                            />
                        )}
                    />
                </div>
                <Button
                    loading={loading}
                    disabled={!isDirty || loading}
                    mode="white"
                    size="m"
                    style={{ width: "100%" }}
                    onClick={handleSubmit(onSubmit)}
                >
                    {isEditing ? "Save" : "Add"}
                </Button>
            </List>
        </ModalStyled>
    );
};

export default CardFormModal;
