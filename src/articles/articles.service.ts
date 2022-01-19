import {
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import slugify from 'slugify';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateArticleInput } from './dto/create-article.input';
import { User } from '@/users/entities/user.entity';
import { Article } from './entities/article.entity';
import { UpdateArticleInput } from './dto/update-article.input';
import { IArticleResponse } from './types/article-response.interface';
import { IArticlesResponse } from './types/articles-response.interface';
import { TagsService } from '@/tags/tags.service';
import { FilterArticleInput } from './dto/filter-article.input';
import { LIMIT, OFFSET } from '@/app/constants';

@Injectable()
export class ArticlesService {
	constructor(
		@InjectRepository(Article)
		private readonly articlesRepository: Repository<Article>,
		private readonly tagsService: TagsService,
	) {}

	async create(input: CreateArticleInput, user: User): Promise<Article> {
		const article = new Article();
		Object.assign(article, input);
		// const article = Object.assign(new Article(), input);
		if (article.tagList) {
			article.tagList.forEach((title) => {
				this.tagsService.createIfNotExists(title);
			});
		}
		article.slug = this.getSlug(article.title);
		article.author = user;
		return this.articlesRepository.save(article);
	}

	async findAll(
		filter: FilterArticleInput,
		userId: string,
	): Promise<IArticlesResponse> {
		filter.offset = filter.offset ? filter.offset : OFFSET;
		filter.limit = filter.limit ? filter.limit : LIMIT;
		console.log('filter', filter);
		// let qBuilder = getRepository(Article).createQueryBuilder('articles');
		let qBuilder = this.articlesRepository.createQueryBuilder('articles');
		qBuilder = qBuilder.leftJoinAndSelect('articles.author', 'author');
		if (filter.author) {
			qBuilder = qBuilder.andWhere('author.username = :authorUsername', {
				authorUsername: filter.author,
			});
		}
		if (filter.tag) {
			qBuilder = qBuilder.andWhere('(:tag = ANY (articles.tagList))', {
				tag: filter.tag,
			});
		}
		qBuilder = qBuilder
			.skip(filter.offset)
			.take(filter.limit)
			// .offset(filter.offset)
			// .limit(filter.limit)
			.orderBy('articles.updatedAt', 'DESC');

		const [articles, articlesCount] = await qBuilder.getManyAndCount();
		return { articles, articlesCount };
	}

	async findOneBySlug(slug: string): Promise<Article> {
		return this.articlesRepository.findOne({ slug });
	}

	async findOneByTitle(title: string): Promise<Article> {
		return this.articlesRepository.findOne({ title });
	}

	async update(
		slug: string,
		userId: string,
		input: UpdateArticleInput,
	): Promise<Article> {
		const article = await this.findOneBySlug(slug);
		if (!article) {
			throw new NotFoundException('Article does not exist');
		}
		if (article.author.id !== userId) {
			throw new ForbiddenException('You are not owner of this article');
		}
		Object.assign(article, input);
		if (input.title) {
			article.slug = this.getSlug(article.title);
		}
		return this.articlesRepository.save(article);
	}

	async delete(slug: string, userId: string): Promise<UpdateResult> {
		const article = await this.findOneBySlug(slug);
		if (!article) {
			throw new NotFoundException('Article does not exist');
		}
		if (article.author.id !== userId) {
			throw new ForbiddenException('You are not owner of this article');
		}
		return this.articlesRepository.softDelete({ slug });
		// return this.articlesRepository.softDelete(article);
	}

	private getSlug(title: string): string {
		function getRandomPart(): string {
			return '-' + ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
		}

		// return slugify(title, { lower: true });
		return slugify(title, { lower: true }) + getRandomPart();
	}

	buildArticleResponse(article: Article): IArticleResponse {
		return { article };
	}

	buildArticlesResponse(articles: Article[]): IArticlesResponse {
		return { articles, articlesCount: articles.length };
	}
}
