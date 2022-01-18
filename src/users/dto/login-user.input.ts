import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserInput {
	@IsNotEmpty()
	@IsEmail()
	@IsString()
	readonly email: string;

	@IsNotEmpty()
	@IsString()
	readonly password: string;
}
