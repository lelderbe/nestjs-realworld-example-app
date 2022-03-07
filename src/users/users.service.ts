import * as bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import {
	Injectable,
	UnauthorizedException,
	UnprocessableEntityException,
} from '@nestjs/common';
import { FindConditions, FindOneOptions, ILike, Raw, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';
import { UserResponse } from './types/user-response.interface';
import { UpdateUserInput } from './dto/update-user.input';
import { Article } from '@/articles/entities/article.entity';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
	) {}

	async create(input: CreateUserInput): Promise<User> {
		// TODO: make it better - use citext maybe
		// mail@mail.ru == MAIL@mail.ru atm
		// const userByEmail = await this.usersRepository.findOne({
		// 	email: input.email,
		// });
		// const userByEmail = await this.findOneByEmail(input.email);
		// const userByEmail = await this.usersRepository.findOne({
		// 	email: ILike(input.email),
		// });
		// const userByEmail = await this.findOne({
		// 	email: ILike(input.email),
		// });
		// const userByEmail = await this.usersRepository.findOne({
		// 	email: Raw((alias) => `lower(${alias}) = lower(:email)`, {
		// 		email: input.email,
		// 	}),
		// });
		const userByEmail = await this.findOneByEmail(input.email);
		// TODO: use citext maybe here too?
		// const userByUsername = await this.usersRepository.findOne({
		// 	username: input.username,
		// });
		// const userByUsername = await this.usersRepository.findOne({
		// 	username: Raw((alias) => `lower(${alias}) = lower(:username)`, {
		// 		username: input.username,
		// 	}),
		// });
		const userByUsername = await this.findOneByUsername(input.username);
		if (userByEmail || userByUsername) {
			console.log(userByEmail, userByUsername);
			const errors = {};
			if (userByEmail) {
				errors['email'] = ['email is already taken'];
			}
			if (userByUsername) {
				errors['username'] = ['username is already taken'];
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

	// async findOne(id: string): Promise<User> {
	// 	return this.usersRepository.findOne({ id });
	// }

	async update(userId: string, input: UpdateUserInput): Promise<User> {
		const user = await this.findOne({ id: userId });
		const userByEmail =
			// ? await this.findOne({ email: input.email })
			input.email &&
				user.email.toLocaleLowerCase() !== input.email.toLocaleLowerCase()
				? await this.findOneByEmail(input.email)
				: null;
		const userByUsername =
			// ? await this.findOne({ username: input.username })
			input.username &&
				user.username.toLocaleLowerCase() !== input.username.toLocaleLowerCase()
				? await this.findOneByUsername(input.username)
				: null;
		if (userByEmail || userByUsername) {
			const errors = {};
			if (userByEmail) {
				errors['email'] = ['email is already taken'];
			}
			if (userByUsername) {
				errors['username'] = ['username is already taken'];
			}
			throw new UnprocessableEntityException({ errors });
		}
		Object.assign(user, input);
		return this.usersRepository.save(user);
	}

	async addArticleToFavorites(userId: string, article: Article): Promise<boolean> {
		const user = await this.usersRepository.findOne(userId, {
			relations: ['favorites'],
		});
		if (!user) {
			throw new UnauthorizedException('Not authorized');
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

	async removeArticleFromFavorites(userId: string, article: Article): Promise<boolean> {
		const user = await this.usersRepository.findOne(userId, {
			relations: ['favorites'],
		});
		if (!user) {
			throw new UnauthorizedException('Not authorized');
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

	async getValidatedUser(email: string, password: string): Promise<User> {
		const user = await this.findOne(
			{ email },
			{ select: ['id', 'username', 'email', 'password', 'bio', 'image'] },
		);
		if (!user || !(await bcrypt.compare(password, user.password))) {
			// TODO: make constants for exceptions text
			throw new UnauthorizedException('Invalid credentials');
		}
		delete user.password;
		return user;
	}

	buildUserResponse(user: User): UserResponse {
		if (!user) {
			throw new UnauthorizedException('Not authorized');
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
