import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { CurrentUser } from './decorators/user.decorator';
import { CreateUserInput } from './dto/create-user.input';
import { LoginUserInput } from './dto/login-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
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
		return this.usersService.buildUserResponse(user);
		// return this.usersService.login(user);
	}

	// @UseGuards(LocalAuthGuard)
	// @Post('users/login')
	// async login(@CurrentUser() user: User): Promise<IUserResponse> {
	// 	return this.usersService.login(user);
	// }

	@Post('users/login')
	async login(@Body('user') input: LoginUserInput): Promise<IUserResponse> {
		const user = await this.usersService.validateUser(
			input.email,
			input.password,
		);
		return this.usersService.buildUserResponse(user);
		// return this.usersService.login(user);
	}

	@UseGuards(AuthGuard)
	@Get('user')
	async findOne(@CurrentUser() user: User): Promise<IUserResponse> {
		return this.usersService.buildUserResponse(user);
	}

	@UseGuards(AuthGuard)
	@Put('user')
	async update(
		@Body('user') input: UpdateUserInput,
		@CurrentUser() user: User,
	): Promise<IUserResponse> {
		user = await this.usersService.update(user, input);
		return this.usersService.buildUserResponse(user);
		// return this.usersService.login(user);
	}
}
