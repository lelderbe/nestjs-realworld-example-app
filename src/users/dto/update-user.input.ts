import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { CreateUserInput } from './create-user.input';

export class UpdateUserInput extends PartialType(CreateUserInput) {
	@IsOptional()
	@IsString()
	readonly bio?: string;

	@IsOptional()
	@IsString()
	readonly image?: string;
}
