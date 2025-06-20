const BASE_API_URL = "https://api.datamuse.com";

export default class DatamuseService {
    async findSuggestions(word: string): Promise<string[]> {
        const url = new URL(`${BASE_API_URL}/sug`);
        url.searchParams.append("s", word);
        url.searchParams.append("max", "5");
        console.log("url", url.toString());

        const response = await fetch(url.toString())
            .then((res) => res.json())
            .catch((error) => {
                throw new Error("Failed to fetch suggestions: " + error.message);
            });

        return response.map((item: { word: string }) => item.word);
    }

    async findSimilarWords(word: string): Promise<string[]> {
        const response = await fetch(`https://api.datamuse.com/words?ml=${word}`)
            .then((res) => res.json())
            .catch((error) => {
                throw new Error("Failed to fetch similar words: " + error.message);
            });

        return response.map((item: { word: string }) => item.word);
    }
}
