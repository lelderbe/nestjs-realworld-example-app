import { Controller, Get } from '@nestjs/common';
import { TagsService } from '@/tags/tags.service';

@Controller('tags')
export class TagsController {
	constructor(private readonly tagsService: TagsService) {}

	@Get()
	findAll(): string[] {
		return this.tagsService.findAll();
	}
}
