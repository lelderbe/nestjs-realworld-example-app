import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	async createUser(@Body('user') input: CreateUserInput): Promise<User> {
		console.log('input', input);
		return this.usersService.create(input);
	}
}
