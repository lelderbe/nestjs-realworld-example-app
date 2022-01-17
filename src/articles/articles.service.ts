import {
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { CreateArticleInput } from './dto/create-article.input';
import { User } from '@/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Repository, UpdateResult } from 'typeorm';
import { IArticleResponse } from './types/article-response.interface';
import slugify from 'slugify';

@Injectable()
export class ArticlesService {
	constructor(
		@InjectRepository(Article)
		private readonly articlesRepository: Repository<Article>,
	) {}

	buildArticleResponse(article: Article): IArticleResponse {
		return { article };
	}

	async create(input: CreateArticleInput, user: User): Promise<Article> {
		const article = new Article();
		Object.assign(article, input);
		if (!article.tagList) {
			article.tagList = [];
		}
		article.slug = this.getSlug(article.title);
		article.author = user;
		return this.articlesRepository.save(article);
	}

	async findOneBySlug(slug: string): Promise<Article> {
		return this.articlesRepository.findOne(
			{ slug },
			// { relations: ['author'] },
		);
	}

	async delete(slug: string, authorId: string): Promise<UpdateResult> {
		const article = await this.findOneBySlug(slug);
		if (!article) {
			throw new NotFoundException('Article does not exist');
		}
		if (article.author.id !== authorId) {
			throw new ForbiddenException('You are not owner of this article');
		}
		return this.articlesRepository.softDelete({ slug });
		// return this.articlesRepository.softDelete(article);
	}

	private getSlug(title: string): string {
		function getRandomPart(): string {
			return '-' + ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
		}

		return slugify(title, { lower: true }) + getRandomPart();
	}
}
