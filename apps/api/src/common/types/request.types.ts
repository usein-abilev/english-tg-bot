import { FastifyRequest } from "fastify";
import { TgInitData } from "./tgInitData.types";

export interface ClientRequest extends FastifyRequest {
    initData: TgInitData;
}
