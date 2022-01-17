import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { CurrentUser } from './decorators/user.decorator';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { AuthGuard } from './guards/auth.guard';
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
		// console.log('UsersController register(), input:', input);
		const user = await this.usersService.create(input);
		// TODO: check user in case create (save) fail
		return this.usersService.login(user);
	}

	@UseGuards(LocalAuthGuard)
	@Post('users/login')
	async login(@CurrentUser() user): Promise<IUserResponse> {
		// console.log('UsersController login()');
		return this.usersService.login(user);
	}

	// @UseGuards(JwtAuthGuard)
	@UseGuards(AuthGuard)
	@Get('user')
	async findOne(@CurrentUser() user): Promise<IUserResponse> {
		return this.usersService.buildUserResponse(user);
	}

	// @UseGuards(JwtAuthGuard)
	@Put('user')
	async update(
		@Body('user') input: UpdateUserInput,
		@CurrentUser() user,
	): Promise<IUserResponse> {
		user = await this.usersService.update(user, input);
		return this.usersService.login(user);
	}
}
