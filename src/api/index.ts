import { DataSource, ILike } from "typeorm";
import UserEntity from "./db/entities/user.entity";
import Debug from "./decorators/debug.decorator";
import UserCardEntity from "./db/entities/userCard.entity";
import DictionaryService from "./services/dictionary.service";
import DatamuseService from "./services/datamuse.service";
import calcSuperMemo2 from "../utils/calcSM2.util";
import TranslationService from "./services/translation.service";
import SentenceEntity from "./db/entities/sentence.entity";
import WordMeaningEntity, { CardCEFRLevel, CardPartOfSpeech } from "./db/entities/meaning.entity";

export interface ICreateUserOptions {
    username: string;
    firstName: string;
    lastName?: string;
    languageCode?: string;
}

export interface IAddCardOptions {
    name: string;
    // sourceLangCode: SupportedLanguageCode;
    // targetLangCode: SupportedLanguageCode;
    // translation?: string;
    // meanings: UserCardEntityMeaning[];
}

export interface IGetRandomWordsOptions {
    /**
     * Words to exclude from the result.
     */
    exclude?: string[];

    /**
     * The number of words to return.
     * Minimum is 1. Default is 10.
     */
    limit?: number;
    level?: CardCEFRLevel;
    partOfSpeech?: CardPartOfSpeech;
}

class LanguageBotAPI {
    public dictionaryAPI: DictionaryService;
    public datamuseAPI: DatamuseService;
    public translation: TranslationService;

    constructor(private dataSource: DataSource) {
        this.dictionaryAPI = new DictionaryService();
        this.datamuseAPI = new DatamuseService();
        this.translation = new TranslationService();
    }

    /**
     * Creates a new user if it does not exist.
     * @returns - the user id.
     */
    @Debug()
    async createUserIfNotExists(options: ICreateUserOptions): Promise<UserEntity> {
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

            return userRepository.save(user);
        }

        return existingUser;
    }

    async getUserByUsername(username: string): Promise<UserEntity | null> {
        const userRepository = this.dataSource.getRepository(UserEntity);
        return await userRepository
            .createQueryBuilder("user")
            .where("user.username = :username", { username })
            .getOne();
    }

    @Debug({ name: "LanguageBotAPI.getRandomWords" })
    async getRandomWords(options: IGetRandomWordsOptions = {}): Promise<WordMeaningEntity[]> {
        const wordRepo = this.dataSource.getRepository(WordMeaningEntity);
        const query = wordRepo.createQueryBuilder("meanings");

        if (options.partOfSpeech) {
            query.andWhere(`"meanings"."partOfSpeech" = :partOfSpeech`, {
                partOfSpeech: options.partOfSpeech,
            });
        }

        if (options.level) {
            query.andWhere(`"meanings"."level" = :level`, {
                level: options.level,
            });
        }

        if (Array.isArray(options.exclude) && options.exclude.length > 0) {
            query.andWhere(`meanings.name NOT IN (:...exclude)`, { exclude: options.exclude });
        }

        return query
            .orderBy("RANDOM()")
            .limit(options.limit || 10)
            .leftJoinAndSelect("meanings.word", "word")
            .getMany();
    }

    async getSentencesWithWord(word: string): Promise<SentenceEntity[]> {
        const sentenceRepo = this.dataSource.getRepository(SentenceEntity);
        const items = await sentenceRepo.find({
            where: {
                text: ILike(`%${word}%`),
            },
        });

        return items;
    }

    async cardExists(userId: number, name: string): Promise<boolean> {
        const cardRepo = this.dataSource.getRepository(UserCardEntity);
        const exists = await cardRepo.existsBy({ user: { id: userId }, word: { name } });
        return exists;
    }

    // TODO: Refactor addCard method
    async addCard(userId: number, options: IAddCardOptions): Promise<UserCardEntity> {
        const cardRepo = this.dataSource.getRepository(UserCardEntity);
        const card = new UserCardEntity();
        // card.title = options.name;
        // card.languageCode = options.sourceLangCode;
        // card.translationLanguage = options.targetLangCode;
        // card.translation = options.translation || "";
        // card.meanings = options.meanings.map(
        //     (m) =>
        //         ({
        //             audioUrl: m.audioUrl || "",
        //             definition: m.definition || "",
        //             example: m.example || "",
        //             partOfSpeech: m.partOfSpeech || "",
        //             phonetic: m.phonetic || "",
        //             translatedDefinition: m.translatedDefinition || "",
        //             translatedExample: m.translatedExample || "",
        //         }) as UserCardEntityMeaning,
        // );
        // card.user = { id: userId } as UserEntity;
        // card.nextReviewAt = new Date();

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
        const qb = cardRepo.createQueryBuilder("user_cards");
        qb.where("user_cards.userId = :id", { id: userId })
            .leftJoinAndSelect("user_cards.words", "words")
            .andWhere(`"user_cards"."nextReviewAt" <= NOW()`)
            .orderBy(`"user_cards"."nextReviewAt"`, "ASC")
            .limit(maxCards);

        return await qb.getMany();
    }

    async getUserCardsCount(userId: number): Promise<number> {
        const cardRepo = this.dataSource.getRepository(UserCardEntity);
        return await cardRepo.countBy({ user: { id: userId } });
    }
}

export default LanguageBotAPI;
