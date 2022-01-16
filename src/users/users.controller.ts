import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from './decorators/user.decorator';
import { CreateUserInput } from './dto/create-user.input';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { IUserResponse } from './types/user-response.interface';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post('users')
	async register(
		@Body('user') input: CreateUserInput,
	): Promise<IUserResponse> {
		// console.log('AuthController register(), input:', input);
		const user = await this.usersService.register(input);
		return this.usersService.login(user);
	}

	@UseGuards(LocalAuthGuard)
	@Post('users/login')
	async login(@CurrentUser() user): Promise<IUserResponse> {
		// console.log('AuthController login()');
		return this.usersService.login(user);
	}

	@UseGuards(JwtAuthGuard)
	@Get('user')
	async findOne(@CurrentUser() user): Promise<IUserResponse> {
		return this.usersService.login(user);
	}
}
