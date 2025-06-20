/**
 * Formats the query parameters object into a URLSearchParams object.
 * Removes any undefined values from the object.
 */
export const formatQueryParams = (params: object) => {
    const cleanedParams = Object.entries(params).reduce(
        (acc, [key, value]) => {
            if (value !== undefined) {
                acc[key] = value;
            }
            return acc;
        },
        {} as Record<string, any>,
    );

    return new URLSearchParams(cleanedParams as any);
};
