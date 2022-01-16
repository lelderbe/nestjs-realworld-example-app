import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { CreateUserInput } from '@/users/dto/create-user.input';
import { User } from '@/users/entities/user.entity';
import { UsersService } from '@/users/users.service';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly usersService: UsersService,
	) {}

	@Post('users')
	async register(@Body('user') input: CreateUserInput): Promise<any> {
		console.log('AuthController register(), input:', input);
		const user = await this.usersService.create(input);
		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}
		return this.authService.login(user);
	}
}
