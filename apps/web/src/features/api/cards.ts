import { infiniteQueryOptions, keepPreviousData, useMutation } from "@tanstack/react-query";
import { API_URL } from "../../constants/config";
import fetchAPI from "../fetchAPI";
import { queryClient } from "../reactQuery";
import { USER_QUERY_KEY } from "./user";
import { GetElementsResponse } from "../types/common.types";
import { CardSchema } from "../types/deck.types";
import { DECKS_QUERY_KEY } from "./decks";

export const CARDS_QUERY_KEY = "cards";

export interface CreateCardParams {
    deckId: number;
    front: string;
    back: string;
}

const createCard = async (params: CreateCardParams) => {
    return fetchAPI(`${API_URL}/decks/${params.deckId}/cards`, {
        method: "POST",
        body: JSON.stringify(params),
        headers: { "content-type": "application/json" },
    });
};

export interface UpdateCardParams {
    id: number;
    deckId: number;
    front?: string;
    back?: string;
}

const updateCard = async ({ id, deckId, ...params }: UpdateCardParams) => {
    return fetchAPI(`${API_URL}/decks/${deckId}/cards/${id}`, {
        method: "PUT",
        body: JSON.stringify(params),
        headers: { "content-type": "application/json" },
    });
};

export interface DeleteCardParams {
    deckId: number;
    cardId: number;
}

const deleteCard = async (params: DeleteCardParams) => {
    return fetchAPI(`${API_URL}/decks/${params.deckId}/cards/${params.cardId}`, {
        method: "DELETE",
    });
};

export interface GetDeckCardsParams {
    limit: number;
    page: number;
    deckId: number;
}

const getDeckCards = async (params: GetDeckCardsParams): Promise<GetElementsResponse<CardSchema>> => {
    const url = new URL(`${API_URL}/decks/${params.deckId}/cards`);
    url.searchParams.append("limit", params.limit.toString());
    url.searchParams.append("page", params.page.toString());
    const response = await fetchAPI(url);
    return response;
};

export const getDecksCardsInfinityQuery = (params: GetDeckCardsParams) => {
    return infiniteQueryOptions({
        queryKey: [CARDS_QUERY_KEY, params.deckId],
        queryFn: ({ pageParam }) => {
            return getDeckCards({ ...params, page: pageParam });
        },
        getNextPageParam: (lastPage) => {
            const { limit, page } = lastPage.pagination;
            return lastPage.items.length < limit ? undefined : page + 1;
        },
        placeholderData: keepPreviousData,
        initialPageParam: 0,
        staleTime: 30_000,
    });
};

export const useCreateCardMutation = () => {
    return useMutation({
        mutationKey: ["createCard"],
        mutationFn: createCard,
        onSuccess: (response) => {
            console.log("[useCreateCardMutation]: Card created:", response);
            queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [CARDS_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [DECKS_QUERY_KEY, response.deckId] });
        },
    });
};
export const useUpdateCardMutation = () => {
    return useMutation({
        mutationKey: ["updateCard"],
        mutationFn: updateCard,
        onSuccess: (response) => {
            console.log("[useUpdateCardMutation]: Card updated:", response);
            queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [CARDS_QUERY_KEY] });
            // queryClient.invalidateQueries({ queryKey: [DECKS_QUERY_KEY, response.deckId] });
        },
    });
};

export const useDeleteCardMutation = () => {
    return useMutation({
        mutationKey: ["deleteCard"],
        mutationFn: deleteCard,
        onSuccess: (response, params: DeleteCardParams) => {
            console.log("[useDeleteCardMutation]: Card deleted:", response);
            queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [CARDS_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [DECKS_QUERY_KEY, params.deckId] });
        },
    });
};
