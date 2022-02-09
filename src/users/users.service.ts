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
		const userByEmail = await this.usersRepository.findOne({
			email: input.email,
		});
		const userByUsername = await this.usersRepository.findOne({
			username: input.username,
		});
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
		const user = this.usersRepository.create(input);
		return this.usersRepository.save(user);
	}

	async findOne(id: string): Promise<User> {
		return this.usersRepository.findOne({ id });
	}

	async findOneByEmail(email: string): Promise<User> {
		return this.usersRepository.findOne({ email });
	}

	async findOneByName(username: string): Promise<User> {
		return this.usersRepository.findOne({ username });
	}

	async findOneByEmailWithPassword(email: string): Promise<User> {
		return this.usersRepository.findOne(
			{ email },
			{ select: ['id', 'username', 'email', 'password', 'bio', 'image'] },
		);
	}

	async findOneByIdWithFavorites(userId: string): Promise<User> {
		return this.usersRepository.findOne(
			{ id: userId },
			{ relations: ['favorites'] },
		);
	}

	async findOneByNameWithFavorites(username: string): Promise<User> {
		return this.usersRepository.findOne(
			{ username },
			{ relations: ['favorites'] },
		);
	}

	async findOneByIdWithFavoritesAndFollow(userId: string): Promise<User> {
		return this.usersRepository.findOne(
			{ id: userId },
			{ relations: ['favorites', 'follow'] },
		);
	}

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

	async addArticleToFavorites(
		userId: string,
		article: Article,
	): Promise<boolean> {
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

	async removeArticleFromFavorites(
		userId: string,
		article: Article,
	): Promise<boolean> {
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
