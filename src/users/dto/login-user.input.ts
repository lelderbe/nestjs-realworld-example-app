import { IsEmail, IsNotEmpty } from 'class-validator';

// TODO: unused???
export class LoginUserInput {
	@IsNotEmpty()
	@IsEmail()
	readonly email: string;

	@IsNotEmpty()
	readonly password: string;
}
