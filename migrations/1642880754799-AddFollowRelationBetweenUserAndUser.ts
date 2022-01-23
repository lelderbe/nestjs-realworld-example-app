/* eslint-disable prettier/prettier */
import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFollowRelationBetweenUserAndUser1642880754799 implements MigrationInterface {
	name = 'AddFollowRelationBetweenUserAndUser1642880754799';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`CREATE TABLE "users_follow_users" ("usersId_1" uuid NOT NULL, "usersId_2" uuid NOT NULL, CONSTRAINT "PK_3c2535010440dfab17481363b66" PRIMARY KEY ("usersId_1", "usersId_2"))`);
		await queryRunner.query(`CREATE INDEX "IDX_df9b22b12a696d0f1663900647" ON "users_follow_users" ("usersId_1") `);
		await queryRunner.query(`CREATE INDEX "IDX_cb345ee277964f7d825710c3b8" ON "users_follow_users" ("usersId_2") `);
		await queryRunner.query(`ALTER TABLE "users_follow_users" ADD CONSTRAINT "FK_df9b22b12a696d0f1663900647e" FOREIGN KEY ("usersId_1") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
		await queryRunner.query(`ALTER TABLE "users_follow_users" ADD CONSTRAINT "FK_cb345ee277964f7d825710c3b86" FOREIGN KEY ("usersId_2") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "users_follow_users" DROP CONSTRAINT "FK_cb345ee277964f7d825710c3b86"`);
		await queryRunner.query(`ALTER TABLE "users_follow_users" DROP CONSTRAINT "FK_df9b22b12a696d0f1663900647e"`);
		await queryRunner.query(`DROP INDEX "public"."IDX_cb345ee277964f7d825710c3b8"`);
		await queryRunner.query(`DROP INDEX "public"."IDX_df9b22b12a696d0f1663900647"`);
		await queryRunner.query(`DROP TABLE "users_follow_users"`);
	}
}
