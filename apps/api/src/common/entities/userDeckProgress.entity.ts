import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { DeckEntity } from "./deck.entity";

/**
 * UserDeckProgress entity used to store the progress of a user on a deck
 */
@Entity({ name: "user_deck_progress" })
export class UserDeckProgressEntity {
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * The timestamp when the user last reviewed the deck.
     */
    @Column({ type: "timestamp" })
    @Index()
    lastReviewAt!: Date;

    @ManyToOne(() => UserEntity, (user) => user.id)
    user: UserEntity;

    @ManyToOne(() => DeckEntity, (deck) => deck.id)
    deck: DeckEntity;
}
