import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Index,
    ManyToMany,
    OneToMany,
    JoinTable,
} from "typeorm";
import { SupportedLanguageCode } from "../../../utils/lang.util";
import SentenceEntity from "./sentence.entity";
import WordMeaningEntity from "./meaning.entity";

export interface CardMetadata {
    phonetic?: string;
    audioOgg?: string;
    translationRu?: string;
}

@Entity("words")
class WordEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    @Index({ unique: true })
    name!: string;

    @Column({ default: SupportedLanguageCode.EN })
    @Index()
    language!: SupportedLanguageCode;

    @Column("jsonb", { nullable: true })
    metadata!: Partial<CardMetadata>;

    @ManyToMany(() => SentenceEntity, (sentence) => sentence.words)
    @JoinTable()
    sentences!: SentenceEntity[];

    @OneToMany(() => WordMeaningEntity, (meaning) => meaning.word)
    meanings!: WordMeaningEntity[];

    @CreateDateColumn()
    createdAt!: Date;

    constructor(options: Partial<WordEntity> = {}) {
        Object.assign(this, options);
    }
}

export default WordEntity;
