import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "users" })
export class UserEntity {
    @PrimaryColumn({ type: "int8" })
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

    @Column()
    isAppVisited: boolean;

    @Column({ type: "timestamp", default: null, nullable: true })
    @Index()
    lastNotificationAt: Date | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
