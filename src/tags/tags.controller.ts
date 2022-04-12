import { Controller, Get } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsResponse } from './types/tags-response.interface';

@Controller('tags')
export class TagsController {
	constructor(private readonly tagsService: TagsService) {}

	@Get()
	async findAll(): Promise<TagsResponse> {
		const tags = await this.tagsService.findAll();
		return { tags: tags.map((tag) => tag.title) };
	}
}
