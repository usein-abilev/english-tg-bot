import { Injectable } from "@nestjs/common";
import { Interval } from "@nestjs/schedule";
import { DataSource, In } from "typeorm";
import { UserCardProgressEntity } from "../../common/entities/userCardProgress.entity";
import appConfig from "../../configs/app.config";
import { UserEntity } from "../../common/entities/user.entity";

@Injectable()
export class NotificationService {
    private static readonly NOTIFICATION_INTERVAL = 24 * 60 * 60 * 1000;

    constructor(private readonly dataSource: DataSource) {}

    @Interval(NotificationService.NOTIFICATION_INTERVAL)
    async handlePracticeNotification() {
        const users = await this.getUsersToNotify();

        const notifiedUserIds = await Promise.all(
            users.map(async (user) => {
                const ok = await this.sendNotification(user.id, user.cardsToPractice);
                if (!ok) return 0;
                return user.id;
            }),
        ).then((results) => results.filter((id) => id > 0));

        await this.updateLastNotificationAt(notifiedUserIds);
    }

    private async getUsersToNotify() {
        const userRepo = this.dataSource.getRepository(UserEntity);

        const lastNotificationAt = new Date(Date.now() - NotificationService.NOTIFICATION_INTERVAL);
        const usersToNotifyIds = await userRepo
            .createQueryBuilder("user")
            .select("user.id", "id")
            .where(
                "user.lastNotificationAt IS NULL OR user.lastNotificationAt <= :lastNotificationAt",
                { lastNotificationAt },
            )
            .execute()
            .then((rows) => rows.map((row) => row.id))
            .catch((error) => {
                console.error("Error fetching users to notify:", error);
                return [];
            });

        if (!usersToNotifyIds.length) return [];

        const progressRepo = this.dataSource.getRepository(UserCardProgressEntity);
        const users = await progressRepo
            .createQueryBuilder("progress")
            .select("progress.userId", "user_id")
            .addSelect("COUNT(progress.id)", "cards_to_practice")
            .where("progress.userId IN (:...userIds)", {
                userIds: usersToNotifyIds,
            })
            .andWhere("progress.nextReviewAt <= :now", { now: new Date() })
            .groupBy("user_id")
            .having("COUNT(progress.id) > 0")
            .execute();

        if (!users?.length) {
            return [];
        }

        return users.map((row) => ({
            id: row.user_id,
            cardsToPractice: Number(row.cards_to_practice),
        }));
    }

    private async updateLastNotificationAt(userIds: number[]) {
        if (userIds.length === 0) return;
        try {
            const userRepo = this.dataSource.getRepository(UserEntity);
            await userRepo.update({ id: In(userIds) }, { lastNotificationAt: new Date() });
        } catch (error) {
            console.error("Error updating last notification time:", error);
        }
    }

    private async sendNotification(userId: number, cardsToPractice: number): Promise<boolean> {
        const response = await fetch(
            `https://api.telegram.org/bot${appConfig.telegram.token}/sendMessage`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chat_id: userId,
                    text: `You have ${cardsToPractice} cards to practice today!`,
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: "Practice Now",
                                    url: `${appConfig.webURL}/practice`,
                                },
                            ],
                        ],
                    },
                }),
            },
        );

        if (!response.ok) {
            console.error(`Failed to send notification to user ${userId}:`, response.statusText);
            return false;
        }

        return true;
    }
}
