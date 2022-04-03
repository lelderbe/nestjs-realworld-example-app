import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { LIMIT, MAX_LIMIT, OFFSET } from '@/app/constants';

export class FilterArticleInput {
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(0)
	// @Transform(({ value }) => (value ? value : OFFSET))
	readonly offset?: number = OFFSET;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(MAX_LIMIT)
	// @Transform(({ value }) => (value ? value : LIMIT))
	readonly limit?: number = LIMIT;

	@IsOptional()
	@IsString()
	readonly tag?: string;

	@IsOptional()
	@IsString()
	readonly author?: string;

	@IsOptional()
	@IsString()
	readonly favorited?: string;
}
