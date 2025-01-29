import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import WordEntity from "./word.entity";

export enum CardCEFRLevel {
    A1 = "A1",
    A2 = "A2",
    B1 = "B1",
    B2 = "B2",
    C1 = "C1",
    C2 = "C2",
}

export enum CardPartOfSpeech {
    NOUN = "noun",
    VERB = "verb",
    ADJECTIVE = "adjective",
    ADVERB = "adverb",
    PRONOUN = "pronoun",
    PREPOSITION = "preposition",
    CONJUNCTION = "conjunction",
    INTERJECTION = "interjection",
    EXCLAMATION = "exclamation",
}

@Entity("meanings")
@Index(["word.id", "partOfSpeech"], { unique: true })
class WordMeaningEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    @Index()
    name!: string;

    @Column({ type: "enum", enum: CardCEFRLevel })
    @Index()
    level!: CardCEFRLevel;

    @Column({ type: "enum", enum: CardPartOfSpeech })
    @Index()
    partOfSpeech!: CardPartOfSpeech;

    @Column("text")
    @Index()
    definition!: string;

    @ManyToOne(() => WordEntity, (word) => word.meanings)
    word!: WordEntity;

    @CreateDateColumn()
    createdAt!: Date;

    constructor(options: Partial<WordMeaningEntity> = {}) {
        Object.assign(this, options);
    }
}

export default WordMeaningEntity;
