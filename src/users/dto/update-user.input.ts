import { IsOptional } from 'class-validator';

export class UpdateUserInput {
	@IsOptional()
	readonly username?: string;

	@IsOptional()
	readonly email?: string;

	@IsOptional()
	readonly password?: string;

	@IsOptional()
	readonly bio?: string;

	@IsOptional()
	readonly image?: string;
}
