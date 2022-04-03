import {
	Column,
	Entity,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '@/users/entities/user.entity';
import { Comment } from './comment.entity';
import { BaseEntity } from '@/app/entities/base.entity';

@Entity('articles')
export class Article extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	slug: string;

	@Column()
	title: string;

	@Column()
	description: string;

	@Column()
	body: string;

	@Column({ type: 'varchar', array: true, default: [] })
	tagList: string[];

	@Column({ default: 0 })
	favoritesCount: number;

	favorited: boolean;

	// Relations

	@ManyToOne(() => User, (author) => author.articles, { eager: true })
	author: User;

	@OneToMany(() => Comment, (comment) => comment.article)
	comments: Comment[];

	@ManyToMany(() => User, (user) => user.favorites)
	favoritedBy: User[];
}
