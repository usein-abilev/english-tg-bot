import { infiniteQueryOptions, keepPreviousData, useMutation } from "@tanstack/react-query";
import { API_URL } from "../../constants/config";
import fetchAPI from "../fetchAPI";
import { queryClient } from "../reactQuery";
import { USER_QUERY_KEY } from "./user";
import { GetElementsResponse } from "../types/common.types";
import { CardSchema } from "../types/deck.types";
import { DECKS_QUERY_KEY } from "./decks";

export const PRACTICE_QUERY_KEY = "practice";

export interface RateCardParams {
    cardId: number;
    grade: number;
}

const rateCard = async (params: RateCardParams) => {
    return fetchAPI(`${API_URL}/practice/rateCard`, {
        method: "POST",
        body: JSON.stringify(params),
        headers: { "content-type": "application/json" },
    });
};

export const useRateCardMutation = () => {
    return useMutation({
        mutationKey: ["rateCard"],
        mutationFn: rateCard,
        onSuccess: (response) => {
            console.log("[useRateCardMutation]: Card rated:", response);
            queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
            // queryClient.invalidateQueries({ queryKey: [DECKS_QUERY_KEY, ]})
        },
    });
};
