import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserInput } from '@/users/dto/create-user.input';
import { AuthService } from './auth.service';
import { AuthInput } from './dto/auth-login.input';

@Controller()
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('users')
	async register(@Body('user') input: CreateUserInput): Promise<any> {
		console.log('AuthController register(), input:', input);
		const user = await this.authService.register(input);
		return this.authService.login(user);
	}

	@Post('users/login')
	async login(@Body('user') input: AuthInput): Promise<any> {
		console.log('AuthController login()');
		const user = await this.authService.validateUser(
			input.email,
			input.password,
		);
		return this.authService.login(user);
	}
}
