import { IsOptional, IsString } from 'class-validator';
import { PaginateFilterInput } from '@/app/dto/paginate-filter.input';

export class FilterArticleInput extends PaginateFilterInput {
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
