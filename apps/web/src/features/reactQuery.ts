import { DefaultOptions, QueryClient } from "@tanstack/react-query";

export const queryConfig = {
    queries: {
        // throwOnError: true,
        refetchOnWindowFocus: false,
        retry: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
    },
} satisfies DefaultOptions;

export const queryClient = new QueryClient({
    defaultOptions: queryConfig,
});
