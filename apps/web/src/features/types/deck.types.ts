import { UserSchema } from "./user.types";

export interface DeckSchema {
    id: number;
    title: string;
    description: string;
    cards: CardSchema[];
    author: UserSchema;
    createdAt: Date;

    // Merged manually from UserDeckEntity
    lastReviewAt?: Date;
}

export interface CardSchema {
    id: number;
    deck?: DeckSchema;
    term: string;
    definition: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}
