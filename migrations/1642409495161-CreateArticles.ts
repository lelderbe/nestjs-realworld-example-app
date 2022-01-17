import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateArticles1642409495161 implements MigrationInterface {
	name = 'CreateArticles1642409495161';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "articles " ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "slug" character varying NOT NULL, "title" character varying NOT NULL, "description" character varying, "body" character varying, "tagList" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "favoritesCount" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_74bdf56ec393d4fca9c9bb98881" PRIMARY KEY ("id"))`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE "articles "`);
	}
}
