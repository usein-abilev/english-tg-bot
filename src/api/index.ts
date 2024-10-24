import { DataSource } from "typeorm";
import UserEntity from "./db/entities/user.entity";
import Debug from "./decorators/debug.decorator";
import UserCardEntity from "./db/entities/card.entity";
import DictionaryAPI from "./services/dictionary.service";
import DatamuseAPI from "./services/datamuse.service";
import calcSuperMemo2 from "../utils/calcSM2.util";

export interface ICreateUserOptions {
    username: string;
    firstName: string;
    lastName?: string;
    languageCode?: string;
}

export interface IAddCardOptions {
    text: string;
    meaning: string;
}

class LanguageBotAPI {
    public dictionaryAPI: DictionaryAPI;
    public datamuseAPI: DatamuseAPI;

    constructor(private dataSource: DataSource) {
        this.dictionaryAPI = new DictionaryAPI();
        this.datamuseAPI = new DatamuseAPI();
    }

    /**
     * Creates a new user if it does not exist.
     * @returns - the user id.
     */
    @Debug()
    async createUserIfNotExists(options: ICreateUserOptions): Promise<number> {
        if (!options.username || !options.firstName) {
            throw new Error("Username and first name are required.");
        }

        const userRepository = this.dataSource.getRepository(UserEntity);
        const existingUser = await userRepository.findOneBy({ username: options.username });

        if (!existingUser) {
            const user = new UserEntity();
            user.username = options.username;
            user.firstName = options.firstName;
            user.lastName = options.lastName || "";
            user.languageCode = options.languageCode || "en";

            return userRepository.save(user).then((user) => user.id);
        }

        return existingUser.id;
    }

    async getUserByUsername(username: string): Promise<UserEntity | null> {
        const userRepository = this.dataSource.getRepository(UserEntity);
        return await userRepository
            .createQueryBuilder("user")
            .where("user.username = :username", { username })
            .getOne();
    }

    async cardExists(userId: number, title: string): Promise<boolean> {
        const cardRepo = this.dataSource.getRepository(UserCardEntity);
        const exists = await cardRepo.existsBy({ user: { id: userId }, title });
        return exists;
    }

    async addCard(userId: number, options: IAddCardOptions): Promise<UserCardEntity> {
        const cardRepo = this.dataSource.getRepository(UserCardEntity);
        const card = new UserCardEntity();
        card.title = options.text;
        card.meaning = options.meaning;
        card.example = "";
        card.user = { id: userId } as UserEntity;
        card.nextReviewAt = new Date();

        return cardRepo.save(card);
    }

    async rateCard(userId: number, cardId: number, grade: number): Promise<UserCardEntity> {
        return this.dataSource.transaction(async (manager) => {
            const cardRepo = manager.getRepository(UserCardEntity);
            const card = await cardRepo.findOneBy({ id: cardId, user: { id: userId } });
            if (!card) {
                throw new Error("Card not found.");
            }
            const sm = calcSuperMemo2(
                grade,
                card.repetitions + 1,
                card.interval,
                card.easinessFactor,
            );
            card.easinessFactor = sm.easinessFactor;
            card.interval = sm.interval;
            card.repetitions = sm.repetitions;
            card.nextReviewAt = new Date(Date.now() + sm.interval);
            return cardRepo.save(card);
        });
    }

    async getCardsToReview(userId: number, maxCards: number = 10): Promise<UserCardEntity[]> {
        const cardRepo = this.dataSource.getRepository(UserCardEntity);
        const qb = cardRepo.createQueryBuilder("cards");
        qb.where("cards.user_id = :id", { id: userId })
            .andWhere(`"cards"."nextReviewAt" <= NOW()`)
            .orderBy(`"cards"."nextReviewAt"`, "ASC")
            .limit(maxCards);

        return await qb.getMany();
    }

    async getUserCardsCount(userId: number): Promise<number> {
        const cardRepo = this.dataSource.getRepository(UserCardEntity);
        return await cardRepo.countBy({ user: { id: userId } });
    }
}

export default LanguageBotAPI;
