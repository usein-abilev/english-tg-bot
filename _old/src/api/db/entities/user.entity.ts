import {
    CreateDateColumn,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    Index,
    OneToMany,
} from "typeorm";
import UserCardEntity from "./userCard.entity";

@Entity("users")
class UserEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    @Index({ unique: true })
    telegramId!: number;

    @Column({ default: "" })
    @Index({ unique: true })
    username!: string;

    @Column()
    @Index()
    firstName!: string;

    @Column({ default: "" })
    lastName!: string;

    @Column({ default: "en" })
    languageCode!: string;

    @Column({ type: "timestamp", nullable: true })
    @Index()
    lastPracticeDate?: Date;

    @OneToMany(() => UserCardEntity, (userCard) => userCard.user)
    cards!: UserCardEntity[];

    @CreateDateColumn()
    createdAt!: Date;
}

export default UserEntity;
