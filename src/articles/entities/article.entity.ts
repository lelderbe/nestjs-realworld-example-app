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

	// @Column('simple-array')
	// @Column({ name: 'tag_list', type: 'varchar', array: true })
	@Column({ type: 'varchar', array: true })
	tagList: string[]; //["dragons", "training"],

	// @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	// @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
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

	// @Column(() => Boolean)
	// favorited: boolean; // false

	@Column({ default: 0 })
	favoritesCount: number;

	// Relations

	@ManyToOne(() => User, (author) => author.articles, { eager: true })
	author: User;
}
