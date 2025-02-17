import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    Logger,
} from "@nestjs/common";
import { DictionaryResponseItemDto } from "./dictionary.dto";
import appConfig from "../../configs/app.config";

@Injectable()
export class DictionaryService {
    private readonly logger = new Logger(DictionaryService.name);

    constructor() {}

    public async reveal(rawTerm: string) {
        const word = rawTerm.trim();
        if (!word) {
            throw new BadRequestException("Word is required");
        }

        const url = `${appConfig.dictionary.url}/entries/en/${word}`;
        const response = await fetch(url)
            .then((res) => res.json())
            .catch((error) => {
                this.logger.error(error);
                throw new InternalServerErrorException("Error fetching data");
            });

        if (Array.isArray(response)) {
            return response as DictionaryResponseItemDto[];
        }
        throw new InternalServerErrorException("Invalid response");
    }
}
