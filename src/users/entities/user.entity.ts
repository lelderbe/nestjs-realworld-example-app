import * as bcrypt from 'bcrypt';
import {
	BeforeInsert,
	BeforeUpdate,
	Column,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Article } from '@/articles/entities/article.entity';

@Entity('users')
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	username: string;

	@Column()
	email: string;

	@Column({ select: false })
	password: string;

	@Column({ nullable: true })
	bio: string;

	@Column({ nullable: true })
	image: string;

	@BeforeInsert()
	@BeforeUpdate()
	async hashPassword() {
		if (this.password) {
			const saltOrRounds = 10;
			this.password = await bcrypt.hash(this.password, saltOrRounds);
		}
	}

	// Relations

	@OneToMany(() => Article, (article) => article.author)
	articles: Article[];
}
