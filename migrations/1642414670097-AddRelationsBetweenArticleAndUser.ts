/* eslint-disable prettier/prettier */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRelationsBetweenArticleAndUser1642414670097
	implements MigrationInterface {
	name = 'AddRelationsBetweenArticleAndUser1642414670097';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "articles" ADD "authorId" uuid`);
		await queryRunner.query(`ALTER TABLE "articles" ADD CONSTRAINT "FK_63dfa57d8189ef8d16ed9a83dea" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "articles" DROP CONSTRAINT "FK_63dfa57d8189ef8d16ed9a83dea"`);
		await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "authorId"`);
	}
}
