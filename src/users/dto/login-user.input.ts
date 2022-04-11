import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserInput {
	@IsEmail()
	readonly email: string;

	@IsNotEmpty()
	@IsString()
	readonly password: string;
}
