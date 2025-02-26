import { DeckSchema } from "./deck.types";
import { UserSchema } from "./user.types";

export interface DeckPracticeSessionSchema {
    id: number;
    learnedCardsCount: number;
    difficultCardsCount: number;
    averageGrade: number;
    averageEasinessFactor: number;
    averageInterval: number;
    totalCardsCount: number;
    createdAt: Date;
    deck: Partial<DeckSchema>;
    deckId: number;
    user: Partial<UserSchema>;
    userId: number;
}
