import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { User } from '@/users/entities/user.entity';
import { Article } from './article.entity';

@Entity('comments')
export class Comment {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	body: string;

	@CreateDateColumn({ type: 'timestamp' })
	createdAt: Date;

	@UpdateDateColumn({ type: 'timestamp' })
	updatedAt: Date;

	@DeleteDateColumn({ type: 'timestamp' })
	deletedAt: Date;

	// Relations

	@ManyToOne(() => Article, (article) => article.comments)
	article: Article;

	@ManyToOne(() => User, (author) => author.comments, { eager: true })
	author: User;
}
