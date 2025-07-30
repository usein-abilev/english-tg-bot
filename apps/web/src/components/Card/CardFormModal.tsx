import React, { FC, useEffect } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import styled from "styled-components";
import { Modal, List, Textarea } from "@telegram-apps/telegram-ui";
import { useCreateCardMutation, useUpdateCardMutation } from "../../features/api/cards";
import { CardSchema } from "../../features/types/deck.types";
import { Controller, useForm } from "react-hook-form";
// import Button from "../Button/Button";
// import { useFindDefinitionsMutation, useFindSuggestionsMutation } from "../../features/api/dictionary";
// import useDebounce from "../../hooks/useDebounce";

const ModalStyled = styled(Modal)`
    .form-input {
        position: relative;
        margin-bottom: 12px;

        .input-label {
            color: var(--app-section-text-color);
            font-size: 16px;
            font-weight: 500;
            margin-bottom: 6px;
        }

        .form-input-suggestions {
            margin-top: 12px;

            background: var(--app-tertiary-bg-color);
            border-radius: 8px;
            /* box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3); */

            width: 100%;
            display: flex;
            flex-direction: column;
            user-select: none;
            overflow: hidden;

            .suggestion {
                padding: 8px 12px;
                border-bottom: 2px solid var(--app-secondary-bg-color);
                font-size: 16px;
                font-weight: 500;
                cursor: pointer;

                &:active {
                    background: var(--app-secondary-bg-color);
                }
            }

            .suggestion:last-child {
                border-bottom: none;
            }
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
        front: yup.string().trim().min(1, "Required").required("Required"),
        back: yup.string().trim().min(1, "Required").required("Required"),
    })
    .required();

const CardFormModal: FC<CardFormModalProps> = ({ deckId, open, setOpen, card }) => {
    const isEditing = !!card;

    const {
        control,
        reset,
        formState: { isDirty, isSubmitting },
        getValues,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            front: card?.front || "",
            back: card?.back || "",
        },
    });

    const createMutation = useCreateCardMutation();
    const updateMutation = useUpdateCardMutation();
    const loading = createMutation.isPending || updateMutation.isPending || isSubmitting;

    // const [termSuggestions, setTermSuggestions] = React.useState<string[]>([]);

    // const findSuggestionMutation = useFindSuggestionsMutation();
    // const mutateFindSuggestion = useDebounce(() => {
    //     const formValues = getValues();
    //     const term = formValues.term;
    //     if (term.length < 3) return;

    //     findSuggestionMutation.mutate(
    //         {
    //             term: formValues.term,
    //             limit: 3,
    //         },
    //         {
    //             onSuccess: (data) => {
    //                 console.log("suggestion data:", data);
    //                 setTermSuggestions(data);
    //             },
    //             onError: (error) => {
    //                 console.error("Find Suggestion Error", error);
    //             },
    //         },
    //     );
    // }, 650);

    // const [definitionSuggestions, setDefinitionSuggestions] = React.useState<string[]>([]);
    // const findDefinitions = useFindDefinitionsMutation();

    // const handleDefinitionRequest = () => {
    //     const formValues = getValues();
    //     const term = formValues.term;
    //     if (term?.length < 3) return;

    //     findDefinitions.mutate(
    //         {
    //             term: formValues.term,
    //             targetLanguage: "ru",
    //             limit: 3,
    //         },
    //         {
    //             onSuccess: (data) => {
    //                 console.log("definition data:", data);
    //                 if (data.translation) {
    //                     const { translatedText, alternatives } = data.translation;
    //                     const definitions = [translatedText, ...alternatives];
    //                     setDefinitionSuggestions(definitions);
    //                 }
    //             },
    //             onError: (error) => {
    //                 console.error("Find Definitions Error", error);
    //             },
    //         },
    //     );
    // };

    const onSubmit = async (data: any) => {
        if (loading) return;

        const payload = { ...data, deckId };

        const mutation = isEditing
            ? updateMutation.mutateAsync({ ...payload, id: card.id })
            : createMutation.mutateAsync(payload);

        try {
            const result = await mutation;
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

    useEffect(() => {
        if (!open) return;

        Telegram.WebApp.MainButton.show();
        Telegram.WebApp.MainButton.setText(isEditing ? "Save card" : "Add card");

        const onMainButtonClick = () => {
            onSubmit(getValues());
        };

        Telegram.WebApp.MainButton.onClick(onMainButtonClick);

        if (!isDirty) {
            Telegram.WebApp.MainButton.enable();
        } else {
            Telegram.WebApp.MainButton.disable();
        }

        if (loading) {
            Telegram.WebApp.MainButton.showProgress();
        } else {
            Telegram.WebApp.MainButton.hideProgress();
        }

        return () => {
            Telegram.WebApp.MainButton.hide();
            Telegram.WebApp.MainButton.offClick(onMainButtonClick);
        };
    }, [open, isDirty, loading, isEditing]);

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
                        name="front"
                        control={control}
                        disabled={loading}
                        render={({ field }) => (
                            <Textarea
                                disabled={loading}
                                value={field.value}
                                placeholder="E.g. pick up"
                                onChange={(event) => {
                                    field.onChange(event.target.value);
                                    // if (event.target.value.length < 3) {
                                    //     setTermSuggestions([]);
                                    //     return;
                                    // }
                                    // mutateFindSuggestion();
                                }}
                            />
                        )}
                    />
                    {/* {termSuggestions.length > 0 && (
                        <div className="form-input-suggestions">
                            {termSuggestions.map((suggestion) => (
                                <div
                                    key={suggestion}
                                    className="suggestion"
                                    onClick={() => {
                                        setValue("term", suggestion);
                                        setTermSuggestions([]);
                                    }}
                                >
                                    {suggestion}
                                </div>
                            ))}
                        </div>
                    )} */}
                </div>
                <div className="form-input">
                    <div className="input-label">Back side</div>
                    <Controller
                        name="back"
                        control={control}
                        disabled={loading}
                        render={({ field }) => (
                            <Textarea
                                disabled={loading}
                                value={field.value}
                                placeholder="E.g. to lift something off the ground"
                                onChange={(event) => field.onChange(event.target.value)}
                                // onFocus={() => handleDefinitionRequest()}
                            />
                        )}
                    />
                    {/* {definitionSuggestions.length > 0 && (
                        <div className="form-input-suggestions">
                            {definitionSuggestions.map((suggestion) => (
                                <div
                                    key={suggestion}
                                    className="suggestion"
                                    onClick={() => {
                                        setValue("definition", suggestion);
                                        setDefinitionSuggestions([]);
                                    }}
                                >
                                    {suggestion}
                                </div>
                            ))}
                        </div>
                    )} */}
                </div>
                {/* <Button
                    loading={loading}
                    disabled={!isDirty || loading}
                    mode="white"
                    size="m"
                    style={{ width: "100%" }}
                    onClick={handleSubmit(onSubmit)}
                >
                    {isEditing ? "Save" : "Add"}
                </Button> */}
            </List>
        </ModalStyled>
    );
};

export default CardFormModal;
