import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserInput {
	@IsOptional()
	@IsString()
	readonly username?: string;

	@IsOptional()
	@IsEmail()
	@IsString()
	readonly email?: string;

	@IsOptional()
	@IsString()
	readonly password?: string;

	@IsOptional()
	@IsString()
	readonly bio?: string;

	@IsOptional()
	@IsString()
	readonly image?: string;
}
