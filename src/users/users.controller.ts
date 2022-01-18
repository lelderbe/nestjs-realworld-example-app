import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { CurrentUser } from './decorators/user.decorator';
import { CreateUserInput } from './dto/create-user.input';
import { LoginUserInput } from './dto/login-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { AuthGuard } from './guards/auth.guard';
import { IUserResponse } from './types/user-response.interface';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post('users')
	async registerUser(
		@Body('user') input: CreateUserInput,
	): Promise<IUserResponse> {
		const user = await this.usersService.create(input);
		// TODO: check user in case create (save) fail
		return this.usersService.buildUserResponse(user);
	}

	@Post('users/login')
	async loginUser(
		@Body('user') input: LoginUserInput,
	): Promise<IUserResponse> {
		const user = await this.usersService.getValidateUser(
			input.email,
			input.password,
		);
		return this.usersService.buildUserResponse(user);
	}

	@UseGuards(AuthGuard)
	@Get('user')
	async getCurrentUser(@CurrentUser() user: User): Promise<IUserResponse> {
		return this.usersService.buildUserResponse(user);
	}

	@UseGuards(AuthGuard)
	@Put('user')
	async updateCurrentUser(
		@Body('user') input: UpdateUserInput,
		@CurrentUser() user: User,
	): Promise<IUserResponse> {
		user = await this.usersService.update(user, input);
		return this.usersService.buildUserResponse(user);
	}
}
