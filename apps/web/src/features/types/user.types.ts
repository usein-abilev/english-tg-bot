export interface UserSchema {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    languageCode: string;
    photoUrl: string;
    isPremium: boolean;
    allowsWriteToPm: boolean;
    createdAt: Date;
    updatedAt: Date;
}
