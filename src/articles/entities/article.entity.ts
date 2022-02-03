import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { User } from '@/users/entities/user.entity';
import { Comment } from './comment.entity';

@Entity('articles')
export class Article {
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

	// @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	@CreateDateColumn({ type: 'timestamp' })
	createdAt: Date;

	// @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	@UpdateDateColumn({ type: 'timestamp' })
	updatedAt: Date;

	// @BeforeUpdate()
	// updateTimestamp() {
	// 	this.updatedAt = new Date();
	// }

	@DeleteDateColumn({ type: 'timestamp' })
	deletedAt: Date;

	@Column({ default: 0 })
	favoritesCount: number;

	// Relations

	@ManyToOne(() => User, (author) => author.articles, { eager: true })
	author: User;

	@OneToMany(() => Comment, (comment) => comment.article)
	comments: Comment[];

	// 	cascade: true,
	// 	eager: true,
	// @ManyToMany(() => User, (tag) => tag.articles, {})
	// users: User[];
}
