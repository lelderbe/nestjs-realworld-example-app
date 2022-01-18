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
import { IArticleResponse } from './types/article-response.interface';
import { UpdateArticleInput } from './dto/update-article.input';

@Injectable()
export class ArticlesService {
	constructor(
		@InjectRepository(Article)
		private readonly articlesRepository: Repository<Article>,
	) {}

	buildArticleResponse(article: Article): IArticleResponse {
		return { article };
	}

	async findAll() {
		const result = this.articlesRepository.find();
		return result;
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
		return this.articlesRepository.findOne({ slug });
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

	private getSlug(title: string): string {
		function getRandomPart(): string {
			return '-' + ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
		}

		return slugify(title, { lower: true });
		// return slugify(title, { lower: true }) + getRandomPart();
	}
}
