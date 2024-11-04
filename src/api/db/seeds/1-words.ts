import { EntityManager } from "typeorm";
import { TypeORMSeed } from "./seed";
import path from "path";
import fs from "fs/promises";
import { logger } from "../../../utils/logger.util";
import WordEntity from "../entities/word.entity";
import { SupportedLanguageCode } from "../../../utils/lang.util";
import SentenceEntity from "../entities/sentence.entity";
import { CardCEFRLevel, CardPartOfSpeech } from "../entities/meaning.entity";
import Debug from "../../decorators/debug.decorator";

const WORDS_PATH = path.resolve("./dataset/oxford.json");

const SUPPORTED_PART_OF_SPEECH = [
    CardPartOfSpeech.NOUN,
    CardPartOfSpeech.VERB,
    CardPartOfSpeech.ADJECTIVE,
    CardPartOfSpeech.ADVERB,
    CardPartOfSpeech.PRONOUN,
    CardPartOfSpeech.PREPOSITION,
    CardPartOfSpeech.CONJUNCTION,
    CardPartOfSpeech.INTERJECTION,
    CardPartOfSpeech.EXCLAMATION,
];

export default class Words1 implements TypeORMSeed {
    @Debug({ name: "Words.up" })
    public async up(manager: EntityManager): Promise<void> {
        const content = await fs.readFile(WORDS_PATH, "utf-8");
        const words = JSON.parse(content);

        /*
            {
            "id": 1,
            "value": {
                "word": "abandon",
                "href": "https://www.oxfordlearnersdictionaries.com/definition/english/abandon_1",
                "type": "verb",
                "level": "B2",
                "us": {
                    "mp3": "https://www.oxfordlearnersdictionaries.com/media/english/us_pron/a/aba/aband/abandon__us_2.mp3",
                    "ogg": "https://www.oxfordlearnersdictionaries.com/media/english/us_pron_ogg/a/aba/aband/abandon__us_2.ogg"
                },
                "uk": {
                    "mp3": "https://www.oxfordlearnersdictionaries.com/media/english/uk_pron/a/aba/aband/abandon__gb_2.mp3",
                    "ogg": "https://www.oxfordlearnersdictionaries.com/media/english/uk_pron_ogg/a/aba/aband/abandon__gb_2.ogg"
                },
                "phonetics": {
                    "us": "/əˈbændən/",
                    "uk": "/əˈbændən/"
                },
                "examples": [
                    " abandon somebody The baby had been abandoned by its mother.",
                    "People often simply abandon their pets when they go abroad.",
                    " abandon somebody to something ‘We have been abandoned to our fate,’ said one resident.",
                    "The study showed a deep fear among the elderly of being abandoned to the care of strangers."
                ]
            }
        },
        */
        logger.info(`Loaded ${words.length} words from ${WORDS_PATH}`);
        const wordRepo = manager.getRepository(WordEntity);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const processWord = async (word: any) => {
            if (word.value.type && !SUPPORTED_PART_OF_SPEECH.includes(word.value.type.trim())) {
                logger.warn(`Unsupported part of speech: ${word.value.type}`);
                return;
            }

            const [wordEntity] = await wordRepo.query(
                `WITH word_insert AS (
                    INSERT INTO "words" (name, language, metadata)
                    VALUES ($1, $2, $3)
                    ON CONFLICT (name) DO NOTHING
                    RETURNING id
                ), 
                word_select AS (
                    SELECT id FROM words WHERE name = $1
                ), 
                word_final AS (
                    SELECT id FROM word_insert
                    UNION ALL
                    SELECT id FROM word_select
                    LIMIT 1
                )
                INSERT INTO "meanings" (name, level, "partOfSpeech", definition, "wordId")
                VALUES ($1, $4, $5, '', (SELECT id FROM word_final))
                ON CONFLICT ("wordId", "partOfSpeech") DO NOTHING
                RETURNING id AS meaning_id;`,
                [
                    word.value.word,
                    SupportedLanguageCode.EN,
                    {
                        audioOgg: word.value.us?.ogg || word.value.uk?.ogg,
                        phonetic: word.value.phonetics?.us || word.value.phonetics?.uk,
                    },
                    word.value.level.trim() || CardCEFRLevel.A1,
                    word.value.type.trim() || CardPartOfSpeech.NOUN,
                ],
            );

            if (!wordEntity) {
                console.log("WORD NOT FOUND:", word);
                return;
            }

            await manager.save(
                word.value.examples.map((example: string) => {
                    const sentence = new SentenceEntity();
                    sentence.text = example;
                    sentence.words = [{ id: wordEntity.id }] as WordEntity[];
                    return sentence;
                }),
            );
        };

        const CHUNK_SIZE = 200;
        const batches = Math.ceil(words.length / CHUNK_SIZE);

        for (let i = 0; i < batches; i++) {
            logger.info(`Processing batch: (${i + 1}/${batches})`);
            const batch = words.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
            await Promise.all(batch.map(processWord));
        }
    }

    public async down(): Promise<void> {}
}
