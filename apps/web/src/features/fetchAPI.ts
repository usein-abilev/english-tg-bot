import { AUTH_INIT_DATA } from "../constants/config";

async function fetchAPI(input: string | URL | globalThis.Request, init?: RequestInit): Promise<Response> {
    return fetch(input, {
        ...init,
        headers: {
            "x-tg-init-data": AUTH_INIT_DATA,
            ...init?.headers,
        },
    });
}
export default fetchAPI;
