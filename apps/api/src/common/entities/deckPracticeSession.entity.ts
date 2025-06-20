import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { DeckEntity } from "./deck.entity";
import { UserEntity } from "./user.entity";

@Entity("deck_practice_session")
export class DeckPracticeSessionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * The count of cards that the user has learned in the deck.
     */
    @Column("int")
    @Index()
    learnedCardsCount: number;

    /**
     * The count of cards that the user has struggled with in the deck.
     */
    @Column("int")
    @Index()
    difficultCardsCount: number;

    @Column("real")
    @Index()
    averageGrade: number;

    @Column("real")
    @Index()
    averageEasinessFactor: number;

    @Column("real")
    @Index()
    averageInterval: number;

    @Column("int")
    @Index()
    totalCardsCount: number;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => DeckEntity, (deck) => deck.id)
    @JoinColumn({ name: "deckId" })
    deck: DeckEntity;

    @Column()
    deckId: number;

    @ManyToOne(() => UserEntity, (user) => user.id)
    @JoinColumn({ name: "userId" })
    user: UserEntity;

    @Column({ type: "int8" })
    userId: number;
}
