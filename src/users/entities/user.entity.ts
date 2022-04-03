import * as bcrypt from 'bcrypt';
import {
	BeforeInsert,
	BeforeUpdate,
	Column,
	Entity,
	JoinTable,
	ManyToMany,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Article } from '@/articles/entities/article.entity';
import { Comment } from '@/articles/entities/comment.entity';

@Entity('users')
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	username: string;

	@Column()
	email: string;

	@Column({ nullable: true })
	bio: string;

	@Column({ nullable: true })
	image: string;

	@Column({ select: false })
	password: string;

	// Relations

	@OneToMany(() => Article, (article) => article.author)
	articles: Article[];

	@OneToMany(() => Comment, (comment) => comment.author)
	comments: Comment[];

	@ManyToMany(() => Article, (article) => article.favoritedBy)
	@JoinTable({ name: 'users_favorites_articles' })
	favorites: Article[];

	@ManyToMany(() => User)
	@JoinTable()
	follow: User[];

	// Listeners

	@BeforeInsert()
	@BeforeUpdate()
	async hashPassword() {
		if (this.password) {
			const saltOrRounds = 10;
			this.password = await bcrypt.hash(this.password, saltOrRounds);
		}
	}
}
