import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
	) {}

	async create(input: CreateUserInput): Promise<User> {
		console.log('UsersService create(), input:', input);
		const userByEmail = this.usersRepository.findOne({
			email: input.email,
		});
		const userByUsername = this.usersRepository.findOne({
			username: input.username,
		});
		if (userByEmail || userByUsername) {
			throw new UnprocessableEntityException(
				'Email or username are already taken',
			);
		}
		const user = new User();
		Object.assign(user, input);
		return this.usersRepository.save(user);
	}
}
