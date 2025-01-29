import { UserSchema } from "./user.types";

export interface DeckSchema {
    id: number;
    title: string;
    description: string;
    cards: CardSchema[];
    author: UserSchema;
    createdAt: Date;
}

export interface CardSchema {
    id: number;
    deck?: DeckSchema;
    createdAt: Date;
    updatedAt: Date;
}
