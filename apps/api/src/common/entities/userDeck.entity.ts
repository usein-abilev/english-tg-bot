import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { DeckEntity } from "./deck.entity";

/**
 * UserDeck entity - represents user's deck
 */
@Entity({ name: "user_deck" })
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

    @ManyToOne(() => DeckEntity, (deck) => deck.id, {
        onDelete: "CASCADE",
    })
    deck: DeckEntity;
}
