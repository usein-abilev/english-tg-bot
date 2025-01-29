import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "users" })
export class UserEntity {
    @PrimaryColumn()
    @Index({ unique: true })
    id: number;

    @Column({ default: "" })
    @Index()
    username: string;

    @Column()
    @Index()
    firstName: string;

    @Column({ default: "" })
    lastName: string;

    @Column({ default: "en" })
    languageCode: string;

    @Column({ default: "" })
    photoUrl: string;

    @Column()
    isPremium: boolean;

    @Column()
    allowsWriteToPm: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
