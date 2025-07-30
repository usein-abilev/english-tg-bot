import { Module } from "@nestjs/common";
import { NotificationService } from "./notification.service";

@Module({ imports: [], providers: [NotificationService] })
export class NotificationModule {}
