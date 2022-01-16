import * as bcrypt from 'bcrypt';
import {
	Injectable,
	UnauthorizedException,
	UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserResponse } from './dto/user.response';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';
import { IUserResponse } from './types/user-response.interface';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
		private readonly jwtService: JwtService,
	) {}

	async create(input: CreateUserInput): Promise<User> {
		console.log('UsersService create(), input:', input);
		// TODO: make better - use citext maybe
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

	async update(user: User, input: UpdateUserInput): Promise<User> {
		const userByEmail = input.email
			? await this.usersRepository.findOne({ email: input.email })
			: null;
		const userByUsername = input.username
			? await this.usersRepository.findOne({ username: input.username })
			: null;
		if (userByEmail || userByUsername) {
			throw new UnprocessableEntityException(
				'Email or username are already taken',
			);
		}
		Object.assign(user, input);
		return this.usersRepository.save(user);
	}

	login(user: User): IUserResponse {
		// console.log('UsersService login()');
		const payload = { username: user.username, sub: user.id };
		const { id, password, ...rest } = user;
		const result = new UserResponse();
		Object.assign(result, rest);
		result.token = this.jwtService.sign(payload);
		return {
			user: result,
		};
	}

	async validateUser(email: string, password: string): Promise<User> {
		// console.log('UsersService validateUser()');
		const user = await this.findOneByEmailWithPassword(email);
		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}
		const hash = user.password;
		const isPasswordMatch = await bcrypt.compare(password, hash);
		if (!isPasswordMatch) {
			throw new UnauthorizedException('Invalid credentials');
		}
		return user;
	}
}
