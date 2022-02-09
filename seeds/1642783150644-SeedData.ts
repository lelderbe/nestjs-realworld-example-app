import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedData1642783150644 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
			INSERT INTO tags (title) VALUES
				('JavaScript'),
				('Python'),
				('code'),
				('Java');
		`);

		// passwords: 123
		await queryRunner.query(`
			INSERT INTO users (id, username, email, password, bio, image) VALUES
				('7667cb47-9e1f-48aa-ad01-10e86921bf6d', 'joe', 'joe@mail.ru', '$2b$10$ikEdmKFuMsm93qAKfc71y.ywcyR7QVMnURlZNDNr5mXZPg/7rtYg2', 'Joe bio', 'joe-image'),
				('40ce66ea-77a5-492e-a944-a1b0d8a28773', 'mary', 'mary@mail.ru', '$2b$10$ikEdmKFuMsm93qAKfc71y.ywcyR7QVMnURlZNDNr5mXZPg/7rtYg2', 'Mary bio', 'mary-image');
		`);

		await queryRunner.query(`
			INSERT INTO articles (slug, title, description, body, "tagList", "authorId") VALUES
				('javascript-rulez', 'JavaScript rulez', 'Description about JavaScript', 'JavaScript story body here', '{JavaScript}', '7667cb47-9e1f-48aa-ad01-10e86921bf6d'),
				('python-the-best', 'Python the best!', 'Description about Python', 'Python story body here', '{Python,code}', '40ce66ea-77a5-492e-a944-a1b0d8a28773');
		`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		return;
	}
}
