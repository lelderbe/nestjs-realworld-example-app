import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateArticleInput {
	@IsOptional()
	@IsNotEmpty()
	@IsString()
	readonly title?: string;

	@IsOptional()
	readonly description?: string;

	@IsOptional()
	readonly body?: string;

	@IsOptional()
	@IsString({ each: true })
	readonly tagList?: string[];
}
