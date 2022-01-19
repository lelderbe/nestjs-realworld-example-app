import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FilterArticleInput {
	@IsOptional()
	@IsNumber()
	offset?: number;

	@IsOptional()
	@IsNumber()
	limit?: number;

	@IsOptional()
	@IsString()
	tag?: string;

	@IsOptional()
	@IsString()
	author?: string;

	@IsOptional()
	@IsString()
	favorited?: string;
}
