import { useMutation } from "@tanstack/react-query";
import { API_URL } from "../../constants/config";
import fetchAPI from "../fetchAPI";
import { queryClient } from "../reactQuery";
import { USER_QUERY_KEY } from "./user";

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
    return res.json();
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
