import {
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { DeckEntity } from "./deck.entity";

@Entity({ name: "cards" })
export class CardEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => DeckEntity, (deck) => deck.id)
    deck!: DeckEntity;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
