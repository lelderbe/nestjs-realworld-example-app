import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserInput {
	@IsNotEmpty()
	@IsString()
	readonly username: string;

	@IsNotEmpty()
	@IsEmail()
	@IsString()
	readonly email: string;

	@IsNotEmpty()
	@IsString()
	readonly password: string;
}
