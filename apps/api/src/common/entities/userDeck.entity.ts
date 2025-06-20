import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { DeckEntity } from "./deck.entity";

/**
 * UserDeck entity - represents user's deck
 */
@Entity({ name: "user_deck" })
@Index(["userId", "deckId"], { unique: true })
export class UserDeckEntity {
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * The timestamp when the user last reviewed the deck.
     */
    @Column({ type: "timestamp", nullable: true })
    @Index()
    lastReviewAt?: Date;

    @ManyToOne(() => UserEntity, (user) => user.id)
    user: UserEntity;

    @Column({ type: "int8" })
    userId: number;

    @ManyToOne(() => DeckEntity, (deck) => deck.id, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "deckId" })
    deck: DeckEntity;

    @Column()
    deckId: number;
}
