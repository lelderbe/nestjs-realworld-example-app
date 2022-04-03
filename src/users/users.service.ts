import * as bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import {
	Injectable,
	UnauthorizedException,
	UnprocessableEntityException,
} from '@nestjs/common';
import { FindConditions, FindOneOptions, Raw, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';
import { UserResponse } from './types/user-response.interface';
import { UpdateUserInput } from './dto/update-user.input';
import {
	EMAIL_IS_TAKEN,
	INVALID_CREDENTIALS,
	NOT_AUTHORIZED,
	USERNAME_IS_TAKEN,
} from '@/app/constants';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
	) {}

	async create(input: CreateUserInput): Promise<User> {
		const userByEmail = await this.findOneByEmail(input.email);
		const userByUsername = await this.findOneByUsername(input.username);
		if (userByEmail || userByUsername) {
			const errors = {};
			if (userByEmail) {
				errors['email'] = [EMAIL_IS_TAKEN];
			}
			if (userByUsername) {
				errors['username'] = [USERNAME_IS_TAKEN];
			}
			throw new UnprocessableEntityException({ errors });
		}
		const user = this.usersRepository.create(input);
		return this.usersRepository.save(user);
	}

	async findOne(
		conditions: FindConditions<User>,
		options?: FindOneOptions<User>,
	): Promise<User> {
		return this.usersRepository.findOne(conditions, options);
	}

	async findOneByEmail(email: string): Promise<User> {
		return this.usersRepository.findOne({
			email: Raw((alias) => `lower(${alias}) = lower(:email)`, {
				email,
			}),
		});
	}

	async findOneByUsername(username: string): Promise<User> {
		return this.usersRepository.findOne({
			username: Raw((alias) => `lower(${alias}) = lower(:username)`, {
				username,
			}),
		});
	}

	async update(userId: string, input: UpdateUserInput): Promise<User> {
		const user = await this.findOne({ id: userId });
		const userByEmail =
			input.email &&
			user.email.toLocaleLowerCase() !== input.email.toLocaleLowerCase()
				? await this.findOneByEmail(input.email)
				: null;
		const userByUsername =
			input.username &&
			user.username.toLocaleLowerCase() !== input.username.toLocaleLowerCase()
				? await this.findOneByUsername(input.username)
				: null;
		if (userByEmail || userByUsername) {
			const errors = {};
			if (userByEmail) {
				errors['email'] = [EMAIL_IS_TAKEN];
			}
			if (userByUsername) {
				errors['username'] = [USERNAME_IS_TAKEN];
			}
			throw new UnprocessableEntityException({ errors });
		}
		Object.assign(user, input);
		return this.usersRepository.save(user);
	}

	/* Alternative solution
	async addArticleToFavorites(userId: string, article: Article): Promise<boolean> {
		const user = await this.usersRepository.findOne(userId, {
			relations: ['favorites'],
		});
		if (!user) {
			throw new UnauthorizedException(NOT_AUTHORIZED);
		}
		const isNotFavorited =
			user.favorites.findIndex(
				(articleInFavorites) => articleInFavorites.id === article.id,
			) === -1;
		if (!isNotFavorited) {
			return false;
		}
		user.favorites.push(article);
		if (!(await this.usersRepository.save(user))) {
			return false;
		}
		return true;
	}
	*/

	/* Alternative solution
	async removeArticleFromFavorites(userId: string, article: Article): Promise<boolean> {
		const user = await this.usersRepository.findOne(userId, {
			relations: ['favorites'],
		});
		if (!user) {
			throw new UnauthorizedException(NOT_AUTHORIZED);
		}
		const index = user.favorites.findIndex(
			(articleInFavorites) => articleInFavorites.id === article.id,
		);
		if (index === -1) {
			return false;
		}
		user.favorites.splice(index, 1);
		if (!(await this.usersRepository.save(user))) {
			return false;
		}
		return true;
	}
	*/

	async getValidatedUser(email: string, password: string): Promise<User> {
		const user = await this.findOne(
			{ email },
			{ select: ['id', 'username', 'email', 'password', 'bio', 'image'] },
		);
		if (!user || !(await bcrypt.compare(password, user.password))) {
			throw new UnauthorizedException(INVALID_CREDENTIALS);
		}
		delete user.password;
		return user;
	}

	buildUserResponse(user: User): UserResponse {
		if (!user) {
			throw new UnauthorizedException(NOT_AUTHORIZED);
		}
		const { password, ...rest } = user;
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
