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
import WordEntity from "./word.entity";

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
class UserCardEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    @Index()
    name: string = "";

    /**
     * The translation of the word.
     */
    @Column("text", { default: "" })
    @Index()
    translation!: string;

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

    /**
     * Custom meanings for the word.
     */
    @Column("jsonb")
    @Index()
    meanings!: UserCardEntityMeaning[];

    @ManyToOne(() => WordEntity)
    @JoinColumn({ name: "wordId" })
    word!: WordEntity;

    @Column()
    @RelationId((card: UserCardEntity) => card.word)
    wordId!: number;

    @ManyToOne(() => UserEntity, (user) => user.cards)
    @JoinColumn({ name: "userId" })
    user!: UserEntity;

    @Column()
    @RelationId((card: UserCardEntity) => card.user)
    userId!: number;

    @CreateDateColumn()
    createdAt!: Date;
}

export default UserCardEntity;
