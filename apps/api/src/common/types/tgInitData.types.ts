/**
 * User data parsed Telegram Init Data
 */
export interface TgInitDataUser {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    languageCode: string;
    isPremium: boolean;
    allowsWriteToPm: boolean;
    photoUrl: string;
}

/**
 * Parsed data from Telegram Init Data
 */
export interface TgInitData {
    user: TgInitDataUser;
    authDate: string;
    chatInstance: string;
    fromBot: boolean;
}
