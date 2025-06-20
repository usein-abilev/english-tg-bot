import { AUTH_INIT_DATA } from "../constants/config";

export class FetchError extends Error {
    constructor(
        message: string,
        public response: object,
    ) {
        super(message);
    }
}

async function fetchAPIBase(input: string | URL | globalThis.Request, init?: RequestInit): Promise<Response> {
    const response = await fetch(input, {
        ...init,
        headers: {
            "x-tg-init-data": AUTH_INIT_DATA,
            ...init?.headers,
        },
    });
    if (!response.ok) {
        if (response.headers.get("content-type")?.includes("application/json")) {
            const json = await response.json();
            throw new FetchError(response.statusText, json);
        }
        throw new FetchError(response.statusText, {});
    }
    return response;
}

async function fetchAPI<T = any>(input: string | URL | globalThis.Request, init?: RequestInit): Promise<T> {
    const response = await fetchAPIBase(input, init);
    const object = await response.json();
    return object.data;
}
export default fetchAPI;
