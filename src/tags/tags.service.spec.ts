import { Test, TestingModule } from '@nestjs/testing';
import { TagsService } from '@/tags/tags.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { Repository } from 'typeorm';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
	create: jest.fn(() => ({})),
	find: jest.fn(() => []),
	findOne: jest.fn(() => ({})),
	save: jest.fn(() => ({})),
});

describe('TagsService', () => {
	let tagsService: TagsService;
	let tagsRepository: MockRepository;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TagsService,
				{
					provide: getRepositoryToken(Tag),
					useValue: createMockRepository<Tag>(),
				},
			],
		}).compile();

		tagsService = module.get<TagsService>(TagsService);
		tagsRepository = module.get<MockRepository>(getRepositoryToken(Tag));
	});

	it('is defined', () => {
		expect(tagsService).toBeDefined();
	});

	describe('findAll()', () => {
		it('return an array of tags', async () => {
			const expected = [];

			const tags = await tagsService.findAll();

			expect(tags).toEqual(expected);
		});
	});

	describe('findOne()', () => {
		it('return the Tag object when tag with title exists', async () => {
			const tagTitle = '';
			const expected = {};

			const tag = await tagsService.findOne(tagTitle);

			expect(tag).toEqual(expected);
		});
		it("return undefined when tag with title doesn't exists", async () => {
			const tagTitle = '';
			const expected = undefined;
			tagsRepository.findOne.mockResolvedValue(expected);

			const tag = await tagsService.findOne(tagTitle);

			expect(tag).toEqual(expected);
		});
	});

	describe('createIfNotExists()', () => {
		it('return the Tag object when tag with title exists', async () => {
			const tagTitle = '';
			const expected = {};

			const tag = await tagsService.createIfNotExists(tagTitle);

			expect(tag).toEqual(expected);
		});
		it("create and return new Tag object when tag with title doesn't exists", async () => {
			const tagTitle = '';
			const expected = {};
			tagsRepository.findOne.mockResolvedValue(undefined);

			const tag = await tagsService.createIfNotExists(tagTitle);

			expect(tag).toEqual(expected);
		});
	});
});
