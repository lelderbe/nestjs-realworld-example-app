import { Test, TestingModule } from '@nestjs/testing';
import { TagsController } from '@/tags/tags.controller';
import { TagsService } from './tags.service';
import { TagsResponse } from './types/tags-response.interface';
import { Tag } from './entities/tag.entity';

describe('TagsController', () => {
	const mockTagsService: Partial<TagsService> = { findAll: jest.fn() };

	let tagsController: TagsController;
	let tagsService: TagsService;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [TagsController],
			providers: [{ provide: TagsService, useValue: mockTagsService }],
		}).compile();

		tagsController = module.get<TagsController>(TagsController);
		tagsService = module.get<TagsService>(TagsService);
	});

	it('should be defined', () => {
		expect(tagsController).toBeDefined();
	});

	describe('findAll()', () => {
		it('should return an object TagsResponse of tags', async () => {
			const mockTags: Tag[] = [
				{ id: '7667cb47-9e1f-48aa-ad01-10e86921bf6d', title: 'tag1' },
				{ id: '40ce66ea-77a5-492e-a944-a1b0d8a28773', title: 'tag2' },
			];
			const expected: TagsResponse = { tags: ['tag1', 'tag2'] };
			jest.spyOn(tagsService, 'findAll').mockImplementation(() =>
				Promise.resolve(mockTags),
			);

			const tags = await tagsController.findAll();
			expect(tags).toEqual(expected);
		});
	});
});
