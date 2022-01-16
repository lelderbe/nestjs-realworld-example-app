import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthInput {
	@IsNotEmpty()
	@IsEmail()
	readonly email: string;

	@IsNotEmpty()
	readonly password: string;
}
