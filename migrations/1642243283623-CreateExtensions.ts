import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateExtensions1642243283623 implements MigrationInterface {
	name = 'CreateExtensions1642243283623';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		return;
	}
}
