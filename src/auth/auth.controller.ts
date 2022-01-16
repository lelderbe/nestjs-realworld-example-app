import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateUserInput } from '@/users/dto/create-user.input';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from '@/users/decorators/user.decorator';
import { IAuthResponse } from './types/auth-response.interface';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller()
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('users')
	async register(
		@Body('user') input: CreateUserInput,
	): Promise<IAuthResponse> {
		// console.log('AuthController register(), input:', input);
		const user = await this.authService.register(input);
		return this.authService.login(user);
	}

	@UseGuards(LocalAuthGuard)
	@Post('users/login')
	async login(@CurrentUser() user): Promise<IAuthResponse> {
		// console.log('AuthController login()');
		return this.authService.login(user);
	}

	@UseGuards(JwtAuthGuard)
	@Get('user')
	async findOne(@CurrentUser() user): Promise<IAuthResponse> {
		return this.authService.login(user);
	}
}
