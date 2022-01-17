import {
	BeforeUpdate,
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { User } from '@/users/entities/user.entity';

@Entity('articles ')
export class Article {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	slug: string;

	@Column()
	title: string;

	@Column({ nullable: true })
	description: string;

	@Column({ nullable: true })
	body: string;

	@Column('simple-array')
	tagList: string[]; //["dragons", "training"],

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
	deletedAt: Date; //"2016-02-18T03:48:35.824Z",

	// @Column(() => Boolean)
	// favorited: boolean; // false

	@Column({ default: 0 })
	favoritesCount: number; // 0

	// Relations

	// many-to-one
	// @Column()
	// author: User;
}
