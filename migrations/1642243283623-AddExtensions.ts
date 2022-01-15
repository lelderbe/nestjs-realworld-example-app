import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddExtensions1642243283623 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		return;
	}
}
