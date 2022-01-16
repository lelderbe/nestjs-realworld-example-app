import * as bcrypt from 'bcrypt';
import {
	BeforeInsert,
	BeforeUpdate,
	Column,
	Entity,
	PrimaryGeneratedColumn,
} from 'typeorm';

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
		const saltOrRounds = 10;
		this.password = await bcrypt.hash(this.password, saltOrRounds);
	}
}
