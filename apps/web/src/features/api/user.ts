import { queryOptions } from "@tanstack/react-query";
import fetchAPI from "../fetchAPI";
import { queryConfig } from "../reactQuery";
import { API_URL } from "../../constants/config";
import { DeckSchema } from "../types/deck.types";
import { UserSchema } from "../types/user.types";

interface UserQueryResponse {
    user: UserSchema;
    decks: DeckSchema[];
}

const getUserInfo = async (): Promise<UserQueryResponse> => {
    const res = await fetchAPI(`${API_URL}/users/me`);
    const data = await res.json();
    return {
        ...data,
        decks: data.decks.map((relation) => ({
            ...relation.deck,
            lastReviewAt: new Date(relation.lastReviewAt),
        })),
    };
};

export const USER_QUERY_KEY = "user";
export const userQuery = () => {
    return queryOptions({
        ...queryConfig,
        queryKey: [USER_QUERY_KEY],
        queryFn: getUserInfo,
    });
};
