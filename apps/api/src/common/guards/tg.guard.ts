import {
    type CanActivate,
    type ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { validateTelegramInitData } from "../utils/auth.utils";

@Injectable()
export class TgInitDataGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const initData = req.headers?.["x-tg-init-data"];

        const validateResult = await validateTelegramInitData(initData);
        if (initData && validateResult.valid) {
            req.initData = validateResult.data;
            return true;
        }

        throw new UnauthorizedException("Authorization failed");
    }
}
