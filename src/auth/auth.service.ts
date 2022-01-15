import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@/users/users.service';
import { User } from '@/users/entities/user.entity';
import { AuthOutput } from './dto/auth.output';
import { IAuthResponse } from './types/auth-response.interface';

@Injectable()
export class AuthService {
	constructor(
		// private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
	) {}

	login(user: User): IAuthResponse {
		const payload = { username: user.username, sub: user.id };
		const { id, password, ...rest } = user;
		const result = new AuthOutput();
		Object.assign(result, rest);
		result.token = this.jwtService.sign(payload);
		return {
			user: result,
		};
		// return {
		// 	access_token: this.jwtService.sign(payload),
		// 	...user,
		// };
	}
}
