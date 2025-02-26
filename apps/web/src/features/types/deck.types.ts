import { UserSchema } from "./user.types";

export interface DeckSchema {
    id: number;
    title: string;
    description: string;
    cards: CardSchema[];
    author: UserSchema;
    authorId: number;
    public: boolean;
    createdAt: Date;
    updatedAt: Date;
    cardsCount?: number;
    progress?: {
        lastReviewAt?: Date;
        nextReviewAt?: Date;
        cardsToLearnCount: number;
        cardsToReviewCount: number;
    };
}

export interface CardSchema {
    id: number;
    deck?: DeckSchema;
    deckId: number;
    term: string;
    definition: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}
