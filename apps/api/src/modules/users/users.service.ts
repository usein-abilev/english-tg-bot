import { Injectable } from "@nestjs/common";
import { UserEntity } from "../../common/entities/user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { TgInitDataUser } from "../../common/types/tgInitData.types";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly usersRepository: Repository<UserEntity>,
    ) {}

    async getById(id: number): Promise<UserEntity> {
        return this.usersRepository.findOneBy({ id });
    }

    async getOrCreateFromApp(params: TgInitDataUser): Promise<UserEntity> {
        const user = await this.getById(+params.id);
        if (user) return user;
        const newUser = this.usersRepository.create({
            id: +params.id,
            username: params.username,
            firstName: params.firstName,
            lastName: params.lastName,
            languageCode: params.languageCode,
            photoUrl: params.photoUrl,
            isPremium: params.isPremium,
            allowsWriteToPm: params.allowsWriteToPm,
        });
        return this.usersRepository.save(newUser);
    }
}
