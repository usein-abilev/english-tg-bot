import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    OneToMany,
    Column,
    Index,
    ManyToOne,
    JoinColumn,
    UpdateDateColumn,
} from "typeorm";
import { CardEntity } from "./card.entity";
import { UserEntity } from "./user.entity";
import { UserDeckEntity } from "./userDeck.entity";
import { Expose } from "class-transformer";

@Entity({ name: "decks" })
export class DeckEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    @Index()
    title!: string;

    @Column()
    description!: string;

    @Column({ default: false })
    public: boolean;

    @OneToMany(() => CardEntity, (card) => card.deck, {
        cascade: true,
    })
    cards?: CardEntity[];

    @ManyToOne(() => UserEntity, (user) => user.id)
    @JoinColumn({ name: "authorId" })
    author?: UserEntity;

    @Column()
    authorId!: number;

    @OneToMany(() => UserDeckEntity, (userDeck) => userDeck.deck, {
        cascade: true,
    })
    users?: UserDeckEntity[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @Expose()
    cardsCount?: number;
}
