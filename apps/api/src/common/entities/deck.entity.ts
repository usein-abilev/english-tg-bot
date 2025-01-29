import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    OneToMany,
    Column,
    Index,
    ManyToOne,
} from "typeorm";
import { CardEntity } from "./card.entity";
import { UserEntity } from "./user.entity";

@Entity({ name: "decks" })
export class DeckEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    @Index()
    title!: string;

    @Column()
    description!: string;

    @OneToMany(() => CardEntity, (card) => card.deck)
    cards!: CardEntity[];

    @ManyToOne(() => UserEntity, (user) => user.id)
    author: UserEntity;

    @CreateDateColumn()
    createdAt!: Date;
}
