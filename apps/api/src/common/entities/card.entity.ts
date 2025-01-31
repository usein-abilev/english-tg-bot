import {
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    Column,
} from "typeorm";
import { DeckEntity } from "./deck.entity";

@Entity({ name: "cards" })
export class CardEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    /**
     * The term that the card is asking for.
     * E.g. take off
     */
    @Column()
    @Index()
    term: string;

    /**
     * The definition of the term on the back side of the card.
     * E.g. to remove something, especially a piece of clothing
     */
    @Column()
    @Index()
    definition: string;

    /**
     * Optional description of the card.
     * E.g. This phrasal verb is often used in the context of removing clothes.
     */
    @Column({ default: "" })
    description: string;

    /**
     * Optional meta information about the card, used language, etc.
     */
    @Column("jsonb", { nullable: true })
    meta?: object;

    @ManyToOne(() => DeckEntity, (deck) => deck.id)
    deck!: DeckEntity;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
