import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateArticleInput {
	@IsNotEmpty()
	@IsString()
	readonly title: string;

	@IsNotEmpty()
	readonly description: string;

	@IsNotEmpty()
	readonly body: string;

	@IsOptional()
	@IsString({ each: true })
	readonly tagList?: string[];
}
