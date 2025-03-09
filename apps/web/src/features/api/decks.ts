import { infiniteQueryOptions, keepPreviousData, queryOptions, useMutation } from "@tanstack/react-query";
import { API_URL } from "../../constants/config";
import fetchAPI from "../fetchAPI";
import { queryClient, queryConfig } from "../reactQuery";
import { USER_QUERY_KEY } from "./user";
import { DeckSchema } from "../types/deck.types";
import { GetElementsResponse } from "../types/common.types";

export const DECKS_QUERY_KEY = "decks";

export interface CreateDeckParams {
    title: string;
    description: string;
}
const createDeck = async (params: CreateDeckParams) => {
    const res = await fetchAPI(`${API_URL}/decks`, {
        method: "POST",
        body: JSON.stringify(params),
        headers: { "content-type": "application/json" },
    });
    return res;
};

export interface FavoriteDeckParams {
    id: number;
    delete?: boolean;
}

const favoriteDeck = async (params: FavoriteDeckParams) => {
    const res = await fetchAPI(`${API_URL}/decks/${params.id}/favorite`, {
        method: params.delete ? "DELETE" : "POST",
    });
    return res;
};

export interface UpdateDeckParams {
    id: number;
    title: string;
    description: string;
}

const updateDeck = async ({ id, ...params }: UpdateDeckParams) => {
    const res = await fetchAPI(`${API_URL}/decks/${id}`, {
        method: "PUT",
        body: JSON.stringify(params),
        headers: { "content-type": "application/json" },
    });
    return res;
};

const getDeckById = async (id: number) => {
    const response = await fetchAPI(`${API_URL}/decks/${id}`);
    return response as DeckSchema;
};

const deleteDeck = async (deckId: number) => {
    const res = await fetchAPI(`${API_URL}/decks/${deckId}`, {
        method: "DELETE",
    });
    return res;
};

export const getDeckByIdQuery = (id: number, initialData?: DeckSchema) => {
    return queryOptions({
        ...queryConfig,
        queryFn: () => getDeckById(id),
        queryKey: [DECKS_QUERY_KEY, id],
        initialData,
    });
};

export interface FindDecksParams {
    limit: number;
    page: number;
    query?: string;
}

const findDecks = async (params: FindDecksParams): Promise<GetElementsResponse<DeckSchema>> => {
    const url = new URL(`${API_URL}/decks`);
    url.searchParams.append("limit", params.limit.toString());
    url.searchParams.append("page", params.page.toString());
    if (params.query) {
        url.searchParams.append("query", params.query);
    }
    const response = await fetchAPI(url);
    return response;
};

export const findDecksInfinityQuery = (params: FindDecksParams) => {
    return infiniteQueryOptions({
        queryKey: [DECKS_QUERY_KEY, JSON.stringify(params)],
        queryFn: ({ pageParam }) => {
            return findDecks({ ...params, page: pageParam });
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

export const useDeleteDeckMutation = () => {
    return useMutation({
        mutationKey: ["deleteDeck"],
        mutationFn: deleteDeck,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
        },
    });
};

export const useFavoriteDeckMutation = () => {
    return useMutation({
        mutationKey: ["favoriteDeck"],
        mutationFn: favoriteDeck,
        onSuccess: (_, params) => {
            queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [DECKS_QUERY_KEY, params.id] });
        },
    });
};

export const useUpdateDeckMutation = () => {
    return useMutation({
        mutationKey: ["updateDeck"],
        mutationFn: updateDeck,
        onSuccess: (_, params) => {
            queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [DECKS_QUERY_KEY, params.id] });
        },
    });
};

export const useCreateDeckMutation = () => {
    return useMutation({
        mutationKey: ["createDeck"],
        mutationFn: createDeck,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
        },
    });
};
