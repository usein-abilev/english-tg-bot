import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Index,
    ManyToOne,
    JoinColumn,
    RelationId,
} from "typeorm";
import UserEntity from "./user.entity";
import { SupportedLanguageCode } from "../../../utils/lang.util";

export interface UserCardEntityMeaning {
    phonetic: string;
    audioUrl: string;
    partOfSpeech: string;
    definition: string;
    example: string;
    translatedDefinition: string;
    translatedExample: string;
}

@Entity("user_cards")
@Index(["title", "userId"], { unique: true })
class UserCardEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    /**
     * The phrase or word that the user wants to learn.
     */
    @Column()
    @Index()
    title!: string;

    @Column({ default: SupportedLanguageCode.EN })
    @Index()
    languageCode!: SupportedLanguageCode;

    @Column({ default: SupportedLanguageCode.EN })
    @Index()
    translationLanguageCode!: SupportedLanguageCode;

    @Column()
    @Index()
    translation!: string;

    /**
     * The meaning of the word or sentence. For example:
     * - "a person who is present at a meal" is the meaning of the word "guest".
     * or with translation:
     * - "гость" is the meaning of the word "guest".
     */
    @Column("jsonb", { nullable: true })
    meanings!: Partial<UserCardEntityMeaning>[];

    /**
     * The easiness factor is a value from 1.3 that represents how well the user knows the word.
     */
    @Column("float", { default: 1.3 })
    @Index()
    easinessFactor: number = 1.3;

    /**
     * The repetition is the number of times the user has reviewed the word.
     */
    @Column({ default: 0 })
    @Index()
    repetitions: number = 0;

    /**
     * The interval is the number in milliseconds that the user should wait before reviewing the word again.
     */
    @Column({ default: 0 })
    @Index()
    interval: number = 0;

    /**
     * The next review at is the date and time when the user should review the word again.
     */
    @Column()
    @Index()
    nextReviewAt!: Date;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: "userId" })
    user!: UserEntity;

    @Column()
    @RelationId((card: UserCardEntity) => card.user)
    userId!: number;

    @CreateDateColumn()
    createdAt!: Date;
}

export default UserCardEntity;
