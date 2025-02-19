import { infiniteQueryOptions, useMutation } from "@tanstack/react-query";
import { API_URL } from "../../constants/config";
import fetchAPI from "../fetchAPI";
import { GetElementsResponse, PaginatedQueryParams } from "../types/common.types";
import { CardSchema } from "../types/deck.types";
import { formatQueryParams } from "../../utils/queryParams.util";
import { queryClient } from "../reactQuery";
import { USER_QUERY_KEY } from "./user";

export const PRACTICE_QUERY_KEY = "practice";

export interface RateCardParams {
    cardId: number;
    grade: number;
}

export interface RateCardsParams {
    cards: RateCardParams[];
}

const rateCards = async (params: RateCardsParams) => {
    return fetchAPI(`${API_URL}/practice/rateCards`, {
        method: "POST",
        body: JSON.stringify(params),
        headers: { "content-type": "application/json" },
    });
};

interface GetCardsToPracticeParams extends PaginatedQueryParams {
    deckId?: number;
}

const getCardsToPractice = async (
    params: GetCardsToPracticeParams,
): Promise<GetElementsResponse<CardSchema>> => {
    const urlParams = formatQueryParams(params);
    const url = new URL(`${API_URL}/practice/cards?${urlParams}`);

    return fetchAPI(url);
};

export const useRateCardBatchMutation = () => {
    return useMutation({
        mutationKey: ["rateCardBatch"],
        mutationFn: rateCards,
        onSuccess: (response) => {
            console.log("[useRateCardBatchMutation]: Cards rated:", response);
            queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
        },
    });
};

export const getCardsToPracticeQuery = (params: GetCardsToPracticeParams) => {
    return infiniteQueryOptions({
        queryKey: [PRACTICE_QUERY_KEY, "cards", params.deckId ? params.deckId : "all"],
        queryFn: ({ pageParam }) => {
            return getCardsToPractice({ ...params, page: pageParam });
        },
        getNextPageParam: (lastPage) => {
            const { limit, page } = lastPage.pagination;
            return lastPage.items.length < limit ? undefined : page + 1;
        },
        initialPageParam: 0,
        staleTime: 30_000,
    });
};
