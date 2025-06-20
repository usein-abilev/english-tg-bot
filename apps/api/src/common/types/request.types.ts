import { Request } from "express";
import { TgInitData } from "./tgInitData.types";

export interface ClientRequest extends Request {
    initData: TgInitData;
}
