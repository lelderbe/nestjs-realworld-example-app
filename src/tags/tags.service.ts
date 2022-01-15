import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagsService {
	constructor(
		@InjectRepository(Tag) private readonly tagsRepository: Repository<Tag>,
	) {}

	findAll(): Promise<Tag[]> {
		return this.tagsRepository.find();
	}
}
