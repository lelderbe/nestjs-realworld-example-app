import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class FilterArticleInput {
	@IsOptional()
	@Type(() => Number)
	offset?: number;

	@IsOptional()
	@Type(() => Number)
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
