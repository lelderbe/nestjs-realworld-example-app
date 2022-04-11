import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '@/users/entities/user.entity';
import { Article } from './article.entity';
import { BaseEntity } from '@/app/entities/base.entity';

@Entity('comments')
export class Comment extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	body: string;

	// Relations

	@ManyToOne(() => Article, (article) => article.comments)
	article: Article;

	@ManyToOne(() => User, (author) => author.comments, { eager: true })
	author: User;
}
