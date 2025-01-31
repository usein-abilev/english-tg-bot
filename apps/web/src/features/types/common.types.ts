export interface GetElementsResponse<T> {
    items: T[];
    pagination: {
        total: number;
        page: number;
        limit: number;
    };
}
