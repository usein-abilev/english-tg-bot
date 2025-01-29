import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "./user.entity";
import { CardEntity } from "./card.entity";

/**
 * UserCardProgress entity used to store the progress of a user on a card
 */
@Entity({ name: "user_card_progress" })
export class UserCardProgressEntity {
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * The easiness factor is a value from 1.3 that represents how well the user knows the word.
     */
    @Column("real", { default: 1.3 })
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

    @ManyToOne(() => UserEntity, (user) => user.id)
    user: UserEntity;

    @ManyToOne(() => CardEntity, (card) => card.id)
    card: CardEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
