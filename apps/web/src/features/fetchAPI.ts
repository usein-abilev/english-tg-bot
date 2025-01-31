import { AUTH_INIT_DATA } from "../constants/config";

async function fetchAPI(input: string | URL | globalThis.Request, init?: RequestInit): Promise<Response> {
    const response = await fetch(input, {
        ...init,
        headers: {
            "x-tg-init-data": AUTH_INIT_DATA,
            ...init?.headers,
        },
    });
    if (!response.ok) {
        const body = await response.json();
        throw new Error(body.message);
    }
    return response;
}
export default fetchAPI;
