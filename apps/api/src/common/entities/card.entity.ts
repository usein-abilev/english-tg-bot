import {
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    Column,
    JoinColumn,
} from "typeorm";
import { DeckEntity } from "./deck.entity";

@Entity({ name: "cards" })
export class CardEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    /**
     * The front side of the card
     * E.g. take off
     */
    @Column()
    @Index()
    front: string;

    /**
     * The back side of the card.
     * E.g. to remove something, especially a piece of clothing
     */
    @Column()
    @Index()
    back: string;

    /**
     * Optional meta information about the card, used language, etc.
     */
    @Column("jsonb", { nullable: true })
    meta?: object;

    @ManyToOne(() => DeckEntity, (deck) => deck.id, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "deckId" })
    deck!: DeckEntity;

    @Column()
    deckId!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
