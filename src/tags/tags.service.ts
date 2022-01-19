import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagsService {
	constructor(
		@InjectRepository(Tag) private readonly tagsRepository: Repository<Tag>,
	) {}

	async findAll(): Promise<Tag[]> {
		return this.tagsRepository.find();
	}

	async findOne(title: string): Promise<Tag> {
		return this.tagsRepository.findOne({ title });
	}

	async createIfNotExists(title: string): Promise<Tag> {
		let tag = await this.findOne(title);
		if (tag) {
			return tag;
		}
		tag = new Tag();
		tag.title = title;
		return this.tagsRepository.save(tag);
	}
}
