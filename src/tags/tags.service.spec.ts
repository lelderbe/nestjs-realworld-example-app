import { Test, TestingModule } from '@nestjs/testing';
import { TagsService } from '@/tags/tags.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { Repository } from 'typeorm';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
	find: jest.fn(),
	findOne: jest.fn(),
	create: jest.fn(),
	save: jest.fn(),
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
					useValue: createMockRepository(),
				},
			],
		}).compile();

		tagsService = module.get<TagsService>(TagsService);
		tagsRepository = module.get<MockRepository>(getRepositoryToken(Tag));
	});

	it('should be defined', () => {
		expect(tagsService).toBeDefined();
	});

	describe('findAll()', () => {
		it('should return the Tag[]', async () => {
			const expected = [];
			tagsRepository.find.mockResolvedValue(expected);

			const tags = await tagsService.findAll();
			expect(tags).toEqual(expected);
		});
	});

	describe('findOne()', () => {
		describe('when tag with title exists', () => {
			it('should return the Tag object', async () => {
				const tagTitle = 'dragons';
				const expectedTag = {};
				// tagsRepository.findOne.mockReturnValue(expectedTag);
				tagsRepository.findOne.mockResolvedValue(expectedTag);

				const tag = await tagsService.findOne(tagTitle);
				expect(tag).toEqual(expectedTag);
			});
		});
		describe('otherwise', () => {
			it('should return undefined', async () => {
				const tagTitle = 'dragons';
				const expectedTag = undefined;
				tagsRepository.findOne.mockResolvedValue(expectedTag);

				const tag = await tagsService.findOne(tagTitle);
				expect(tag).toEqual(expectedTag);
			});
		});
	});

	describe('createIfNotExists()', () => {
		describe('when tag with title exists', () => {
			it('should return the Tag object', async () => {
				const tagTitle = 'dragons';
				const expectedTag = {};
				tagsRepository.findOne.mockResolvedValue(expectedTag);

				const tag = await tagsService.createIfNotExists(tagTitle);
				expect(tag).toEqual(expectedTag);
			});
		});
		describe('otherwise', () => {
			it('should create and return Tag object', async () => {
				const tagTitle = 'dragons';
				const expectedTag = {};
				tagsRepository.findOne.mockResolvedValue(undefined);
				tagsRepository.create.mockResolvedValue(expectedTag);
				tagsRepository.save.mockResolvedValue(expectedTag);

				const tag = await tagsService.createIfNotExists(tagTitle);
				expect(tag).toEqual(expectedTag);
			});
		});
	});
});
