import { Controller, Get } from '@nestjs/common';
import { TagsService } from './tags.service';
import { ITagsResponse } from './types/tags-response.interface';

@Controller('tags')
export class TagsController {
	constructor(private readonly tagsService: TagsService) {}

	@Get()
	async findAll(): Promise<ITagsResponse> {
		const tags = await this.tagsService.findAll();
		console.log('tags:', tags);
		console.log(
			'mapped:',
			tags.map((tag) => tag.title),
		);
		return { tags: tags.map((tag) => tag.title) };
	}
}
