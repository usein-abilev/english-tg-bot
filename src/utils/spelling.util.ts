import gramma from "gramma";

export async function checkSpelling(text: string) {
    return gramma.check(text);
}

interface ReplaceTransformer {
    offset: number;
    length: number;
    change: string;
}

export async function fixSpelling(text: string, transformers: ReplaceTransformer[]) {
    return gramma.replaceAll(text, transformers);
}
