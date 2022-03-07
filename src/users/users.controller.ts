import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { CurrentUser } from './decorators/user.decorator';
import { CreateUserInput } from './dto/create-user.input';
import { LoginUserInput } from './dto/login-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { AuthGuard } from './guards/auth.guard';
import { UserResponse } from './types/user-response.interface';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post('users')
	async register(@Body('user') input: CreateUserInput): Promise<UserResponse> {
		const user = await this.usersService.create(input);
		// TODO: check user in case create (save) fail
		return this.usersService.buildUserResponse(user);
	}

	@Post('users/login')
	async login(@Body('user') input: LoginUserInput): Promise<UserResponse> {
		const user = await this.usersService.getValidatedUser(
			input.email,
			input.password,
		);
		return this.usersService.buildUserResponse(user);
	}

	@UseGuards(AuthGuard)
	@Get('user')
	async getCurrentUser(@CurrentUser() currentUser: User): Promise<UserResponse> {
		return this.usersService.buildUserResponse(currentUser);
	}

	@UseGuards(AuthGuard)
	@Put('user')
	async updateCurrentUser(
		@Body('user') input: UpdateUserInput,
		@CurrentUser('id') currentUserId: string,
	): Promise<UserResponse> {
		const user = await this.usersService.update(currentUserId, input);
		return this.usersService.buildUserResponse(user);
	}
}
