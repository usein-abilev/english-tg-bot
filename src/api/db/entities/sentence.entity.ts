import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import WordEntity from "./word.entity";

@Entity("sentences")
class SentenceEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("text")
    text!: string;

    @ManyToMany(() => WordEntity, (word) => word.sentences)
    words!: WordEntity[];
}

export default SentenceEntity;
