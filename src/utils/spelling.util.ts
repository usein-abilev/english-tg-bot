import nlp from "compromise/three";
import gramma from "gramma";

export enum SpellingIssueType {
    MISSPELLING = "misspelling",
    TYPOGRAPHICAL = "typographical",
}

export interface SpellingCheckerMatchRule {
    id: string;
    description: string;
    issueType: SpellingIssueType;
    category: { id: string; name: string };
    isPremium: boolean;
}

export interface SpellingCheckerMatchReplacement {
    value: string;
    [key: string]: unknown;
}

export interface SpellingCheckerMatch {
    message: string;
    shortMessage: string;
    replacements: SpellingCheckerMatchReplacement[];
    offset: number;
    length: number;
    context: { text: string; offset: number; length: number };
    sentence: string;
    type: { typeName: string };
    rule: SpellingCheckerMatchRule;
    word: string;
    [key: string]: unknown;
}

export interface SpellingCheckerLanguage {
    name: string;
    code: string;
    detectedLanguage?: {
        name: string;
        code: string;
        confidence: number;
        source: string;
    };
}

export interface SpellingCheckerResult {
    language: SpellingCheckerLanguage;
    matches: SpellingCheckerMatch[];
    [key: string]: unknown;
}

export async function checkSpelling(text: string): Promise<SpellingCheckerResult> {
    return gramma.check(text) as unknown as SpellingCheckerResult;
}

interface ReplaceTransformer {
    offset: number;
    length: number;
    change: string;
}

export function correctSpelling(text: string, transformers: ReplaceTransformer[]) {
    return gramma.replaceAll(text, transformers);
}

/**
 * Tidy up a word by removing articles. If the input is a single word, it will remove articles.
 * Otherwise, it will return the input as is.
 * @param input - The input text to tidy up
 */
export function tidyWord(input: string) {
    const doc = nlp(input);
    const wordsCount = doc.wordCount();

    if (wordsCount <= 2) {
        // Remove articles if it's a word ('a', 'an', 'the')
        // remove 'to' if it's a verb
        return {
            wordsCount: 1,
            text: doc
                .remove("#Determiner")
                .remove("#Conjunction")
                .remove("#Preposition")
                .normalize()
                .out("text"),
        };
    }

    return {
        wordsCount,
        text: input,
    };
}
