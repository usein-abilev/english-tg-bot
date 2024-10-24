import { CreateDateColumn, Column, Entity, PrimaryGeneratedColumn, Index } from "typeorm";

@Entity("users")
class UserEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    @Index({ unique: true })
    username!: string;

    @Column()
    @Index()
    firstName!: string;

    @Column({ default: "" })
    lastName!: string;

    @Column({ default: "en" })
    languageCode!: string;

    @CreateDateColumn()
    createdAt!: Date;
}

export default UserEntity;
