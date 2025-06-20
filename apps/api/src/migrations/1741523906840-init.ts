import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1741523906840 implements MigrationInterface {
    name = "Init1741523906840";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "users" ("id" bigint NOT NULL, "username" character varying NOT NULL DEFAULT '', "firstName" character varying NOT NULL, "lastName" character varying NOT NULL DEFAULT '', "languageCode" character varying NOT NULL DEFAULT 'en', "photoUrl" character varying NOT NULL DEFAULT '', "isPremium" boolean NOT NULL, "allowsWriteToPm" boolean NOT NULL, "isAppVisited" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_a3ffb1c0c8416b9fc6f907b743" ON "users" ("id") `,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_fe0bb3f6520ee0469504521e71" ON "users" ("username") `,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_5372672fbfd1677205e0ce3ece" ON "users" ("firstName") `,
        );
        await queryRunner.query(
            `CREATE TABLE "words" (
                "word" character varying NOT NULL, 
                "lang" character varying NOT NULL, 
                "pos" character varying, "definitions" text array, 
                "examples" text array, 

                CONSTRAINT "PK_97f4077909068d6e45a83289755" PRIMARY KEY ("word", "lang"))
            `,
        );
        await queryRunner.query(
            `CREATE TABLE "cards" ("id" SERIAL NOT NULL, "term" character varying NOT NULL, "definition" character varying NOT NULL, "description" character varying NOT NULL DEFAULT '', "meta" jsonb, "deckId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5f3269634705fdff4a9935860fc" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_c3aaf94db6bc654c2fc2d794d8" ON "cards" ("term") `,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_8f9593fe3ff0d064de68fe0837" ON "cards" ("definition") `,
        );
        await queryRunner.query(
            `CREATE TABLE "decks" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "public" boolean NOT NULL DEFAULT false, "authorId" bigint NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_981894e3f8dbe5049ac59cb1af1" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_6a34783db44c9a42408e584e2c" ON "decks" ("title") `,
        );
        await queryRunner.query(
            `CREATE TABLE "user_deck" ("id" SERIAL NOT NULL, "lastReviewAt" TIMESTAMP, "userId" bigint NOT NULL, "deckId" integer NOT NULL, CONSTRAINT "PK_dc787b58d7790849831bd0c73fd" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_7a61ec5917d8770bf6904e8be7" ON "user_deck" ("lastReviewAt") `,
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_ec09055ae4908ae130d9dfaea1" ON "user_deck" ("userId", "deckId") `,
        );
        await queryRunner.query(
            `CREATE TABLE "user_card_progress" ("id" SERIAL NOT NULL, "easinessFactor" real NOT NULL DEFAULT '1.3', "repetitions" integer NOT NULL DEFAULT '0', "interval" bigint NOT NULL DEFAULT '0', "nextReviewAt" TIMESTAMP NOT NULL, "lastGrade" integer, "streakCount" integer NOT NULL DEFAULT '0', "userId" bigint NOT NULL, "cardId" integer NOT NULL, "deckId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6c643d3a44beb535d53f050c764" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_f24fc1af2a3cc5f2d44efadcc7" ON "user_card_progress" ("easinessFactor") `,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_9841a07f89e98e43d98e2fa223" ON "user_card_progress" ("repetitions") `,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_87f2df506d5d2c05b06a7e929c" ON "user_card_progress" ("interval") `,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_598bbf0e117c25d13c2b5b1bb0" ON "user_card_progress" ("nextReviewAt") `,
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_d6bb5f2256cfd77cc82246114c" ON "user_card_progress" ("userId", "cardId") `,
        );
        await queryRunner.query(
            `CREATE TABLE "deck_practice_session" ("id" SERIAL NOT NULL, "learnedCardsCount" integer NOT NULL, "difficultCardsCount" integer NOT NULL, "averageGrade" real NOT NULL, "averageEasinessFactor" real NOT NULL, "averageInterval" real NOT NULL, "totalCardsCount" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "deckId" integer NOT NULL, "userId" bigint NOT NULL, CONSTRAINT "PK_327b9707aa2ee91de595b27f1b0" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_2666e09b09b32b31ccbb43917a" ON "deck_practice_session" ("learnedCardsCount") `,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_78bd3264968b611f7f4ea6c970" ON "deck_practice_session" ("difficultCardsCount") `,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_da6be288efd0d562676f0b41fb" ON "deck_practice_session" ("averageGrade") `,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_aa1f226c6229a120b746125bb0" ON "deck_practice_session" ("averageEasinessFactor") `,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_04bc712716364e00834adfa65d" ON "deck_practice_session" ("averageInterval") `,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_2890f89b638917f91155eeae74" ON "deck_practice_session" ("totalCardsCount") `,
        );
        await queryRunner.query(
            `ALTER TABLE "cards" ADD CONSTRAINT "FK_e74ee86acf2e667e38582f0a45c" FOREIGN KEY ("deckId") REFERENCES "decks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "decks" ADD CONSTRAINT "FK_5d5cb0d71adc4b7f21d50b94df9" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_deck" ADD CONSTRAINT "FK_cca334b9d4a102ef44fbf8aeabe" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_deck" ADD CONSTRAINT "FK_c4643845afed1399bbd77eec189" FOREIGN KEY ("deckId") REFERENCES "decks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_card_progress" ADD CONSTRAINT "FK_89e9df5f361b725084cb1c11ad0" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_card_progress" ADD CONSTRAINT "FK_5197027387949162f587803bf66" FOREIGN KEY ("cardId") REFERENCES "cards"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_card_progress" ADD CONSTRAINT "FK_836de12ba4158e55e2ffb263daa" FOREIGN KEY ("deckId") REFERENCES "decks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "deck_practice_session" ADD CONSTRAINT "FK_935ecdb26eba5626191cede2855" FOREIGN KEY ("deckId") REFERENCES "decks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "deck_practice_session" ADD CONSTRAINT "FK_66ede55042ac32f655842ed7b5d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "deck_practice_session" DROP CONSTRAINT "FK_66ede55042ac32f655842ed7b5d"`,
        );
        await queryRunner.query(
            `ALTER TABLE "deck_practice_session" DROP CONSTRAINT "FK_935ecdb26eba5626191cede2855"`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_card_progress" DROP CONSTRAINT "FK_836de12ba4158e55e2ffb263daa"`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_card_progress" DROP CONSTRAINT "FK_5197027387949162f587803bf66"`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_card_progress" DROP CONSTRAINT "FK_89e9df5f361b725084cb1c11ad0"`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_deck" DROP CONSTRAINT "FK_c4643845afed1399bbd77eec189"`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_deck" DROP CONSTRAINT "FK_cca334b9d4a102ef44fbf8aeabe"`,
        );
        await queryRunner.query(
            `ALTER TABLE "decks" DROP CONSTRAINT "FK_5d5cb0d71adc4b7f21d50b94df9"`,
        );
        await queryRunner.query(
            `ALTER TABLE "cards" DROP CONSTRAINT "FK_e74ee86acf2e667e38582f0a45c"`,
        );
        await queryRunner.query(`DROP INDEX "public"."IDX_2890f89b638917f91155eeae74"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_04bc712716364e00834adfa65d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_aa1f226c6229a120b746125bb0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_da6be288efd0d562676f0b41fb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_78bd3264968b611f7f4ea6c970"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2666e09b09b32b31ccbb43917a"`);
        await queryRunner.query(`DROP TABLE "deck_practice_session"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d6bb5f2256cfd77cc82246114c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_598bbf0e117c25d13c2b5b1bb0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_87f2df506d5d2c05b06a7e929c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9841a07f89e98e43d98e2fa223"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f24fc1af2a3cc5f2d44efadcc7"`);
        await queryRunner.query(`DROP TABLE "user_card_progress"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ec09055ae4908ae130d9dfaea1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7a61ec5917d8770bf6904e8be7"`);
        await queryRunner.query(`DROP TABLE "user_deck"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6a34783db44c9a42408e584e2c"`);
        await queryRunner.query(`DROP TABLE "decks"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8f9593fe3ff0d064de68fe0837"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c3aaf94db6bc654c2fc2d794d8"`);
        await queryRunner.query(`DROP TABLE "cards"`);
        await queryRunner.query(`DROP TABLE "words"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5372672fbfd1677205e0ce3ece"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fe0bb3f6520ee0469504521e71"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a3ffb1c0c8416b9fc6f907b743"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }
}
