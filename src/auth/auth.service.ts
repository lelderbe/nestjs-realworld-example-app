import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '@/users/users.service';
import { User } from '@/users/entities/user.entity';
import { AuthOutput } from './dto/auth.output';
import { IAuthResponse } from './types/auth-response.interface';
import { CreateUserInput } from '@/users/dto/create-user.input';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
	) {}

	async register(input: CreateUserInput): Promise<User> {
		console.log('AuthService register(), input:', input);
		const user = await this.usersService.create(input);
		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}
		return user;
	}

	login(user: User): IAuthResponse {
		console.log('AuthService login()');
		const payload = { username: user.username, sub: user.id };
		const { id, password, ...rest } = user;
		const result = new AuthOutput();
		Object.assign(result, rest);
		result.token = this.jwtService.sign(payload);
		return {
			user: result,
		};
	}

	async validateUser(email: string, password: string): Promise<User> {
		console.log('AuthService validateUser()');
		const user = await this.usersService.findOneByEmailWithPassword(email);
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
