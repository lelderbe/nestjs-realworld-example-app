import * as bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import {
	Injectable,
	UnauthorizedException,
	UnprocessableEntityException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';
import { IUserResponse } from './types/user-response.interface';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
	) {}

	async create(input: CreateUserInput): Promise<User> {
		// TODO: make it better - use citext maybe
		// mail@mail.ru == MAIL@mail.ru atm
		const userByEmail = await this.usersRepository.findOne({
			email: input.email,
		});
		const userByUsername = await this.usersRepository.findOne({
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

	async findOne(id: string): Promise<User> {
		return this.usersRepository.findOne({ id });
	}

	async findOneByEmail(email: string): Promise<User> {
		return this.usersRepository.findOne({ email });
	}

	async findOneByEmailWithPassword(email: string): Promise<User> {
		return this.usersRepository.findOne(
			{
				email,
			},
			{ select: ['id', 'username', 'email', 'password', 'bio', 'image'] },
		);
	}

	// TODO: how about accept userId instead of user object
	async update(user: User, input: UpdateUserInput): Promise<User> {
		const userByEmail =
			input.email && user.email !== input.email
				? await this.usersRepository.findOne({ email: input.email })
				: null;
		const userByUsername =
			input.username && user.username !== input.username
				? await this.usersRepository.findOne({
					username: input.username,
				})
				: null;
		if (userByEmail || userByUsername) {
			throw new UnprocessableEntityException(
				'Email or username are already taken',
			);
		}
		Object.assign(user, input);
		return this.usersRepository.save(user);
	}

	async getValidateUser(email: string, password: string): Promise<User> {
		const user = await this.findOneByEmailWithPassword(email);
		if (!user || !(await bcrypt.compare(password, user.password))) {
			throw new UnauthorizedException('Invalid credentials');
		}
		return user;
	}

	buildUserResponse(user: User): IUserResponse {
		if (!user) {
			throw new UnauthorizedException('Not authorized');
		}
		const { id, password, ...rest } = user;
		// TODO: make some object return?
		return {
			user: { ...rest, token: this.generateJwt(user) },
		};
	}

	private generateJwt(user: User): string {
		const payload = { username: user.username, sub: user.id };
		return sign(payload, process.env.JWT_SECRET, {
			expiresIn: '1h',
		});
	}
}
