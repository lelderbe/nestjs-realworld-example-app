/* eslint-disable prettier/prettier */
import { MigrationInterface, QueryRunner } from "typeorm";

export class Sync1649014979191 implements MigrationInterface {
	name = 'Sync1649014979191';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "users_favorites_articles" DROP CONSTRAINT "FK_61dc60abcf0035e5ce2aea013bc"`);
		await queryRunner.query(`ALTER TABLE "users_favorites_articles" ADD CONSTRAINT "FK_61dc60abcf0035e5ce2aea013bc" FOREIGN KEY ("articlesId") REFERENCES "articles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "users_favorites_articles" DROP CONSTRAINT "FK_61dc60abcf0035e5ce2aea013bc"`);
		await queryRunner.query(`ALTER TABLE "users_favorites_articles" ADD CONSTRAINT "FK_61dc60abcf0035e5ce2aea013bc" FOREIGN KEY ("articlesId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
	}
}
