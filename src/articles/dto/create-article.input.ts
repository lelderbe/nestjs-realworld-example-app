import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateArticleInput {
	@IsNotEmpty()
	@IsString()
	readonly title: string;

	@IsNotEmpty()
	@IsString()
	readonly description: string;

	@IsNotEmpty()
	@IsString()
	readonly body: string;

	@IsOptional()
	@IsString({ each: true })
	readonly tagList?: string[];
}
