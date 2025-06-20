import { queryOptions, useMutation } from "@tanstack/react-query";
import { API_URL } from "../../constants/config";
import fetchAPI from "../fetchAPI";
import { queryConfig } from "../reactQuery";
import { formatQueryParams } from "../../utils/queryParams.util";

export const DICTIONARY_QUERY_KEY = "dictionary";

interface FindSuggestionsParams {
    term: string;
    limit: number;
}

const findSuggestions = async (params: FindSuggestionsParams) => {
    const searchParams = formatQueryParams(params);
    return fetchAPI(`${API_URL}/dictionary/suggestions?${searchParams}`, {
        method: "GET",
        headers: { "content-type": "application/json" },
    });
};

interface FindDefinitionsParams {
    term: string;
    targetLanguage: string;
    limit: number;
}

const findDefinitions = async (params: FindDefinitionsParams) => {
    const searchParams = formatQueryParams(params);
    return fetchAPI(`${API_URL}/dictionary/definitions?${searchParams}`, {
        method: "GET",
        headers: { "content-type": "application/json" },
    });
};

export const useFindSuggestionsMutation = () => {
    return useMutation({
        mutationKey: [DICTIONARY_QUERY_KEY, "suggestions"],
        mutationFn: findSuggestions,
        ...queryConfig,
    });
};

export const useFindDefinitionsMutation = () => {
    return useMutation({
        mutationKey: [DICTIONARY_QUERY_KEY, "definitions"],
        mutationFn: findDefinitions,
        ...queryConfig,
    });
};
