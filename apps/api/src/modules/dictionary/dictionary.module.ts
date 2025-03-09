import { Module } from "@nestjs/common";
import { DictionaryController } from "./dictionary.controller";
import { DictionaryService } from "./dictionary.service";
import { DictionaryTranslateService } from "./dictionaryTranslate.service";

@Module({
    imports: [],
    controllers: [DictionaryController],
    providers: [DictionaryService, DictionaryTranslateService],
    exports: [DictionaryService],
})
export class DictionaryModule {}
