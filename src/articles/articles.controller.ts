import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Query,
	UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '@/users/decorators/user.decorator';
import { User } from '@/users/entities/user.entity';
import { ArticlesService } from './articles.service';
import { CreateArticleInput } from './dto/create-article.input';
import { IArticleResponse } from './types/article-response.interface';
import { UpdateArticleInput } from './dto/update-article.input';
import { AuthGuard } from '@/users/guards/auth.guard';
import { IArticlesResponse } from './types/articles-response.interface';

@Controller('articles')
export class ArticlesController {
	constructor(private readonly articlesService: ArticlesService) {}

	@Get()
	async findAll(
		@Query() filter: any,
		@CurrentUser('id') userId: string,
	): Promise<IArticlesResponse> {
		console.log('userId', userId);
		console.log('filter', filter);
		const articles = await this.articlesService.findAll(filter, userId);
		return articles;
		// return this.articlesService.buildArticlesResponse(articles);
	}

	@UseGuards(AuthGuard)
	@Post()
	async createArticle(
		@Body('article') input: CreateArticleInput,
		@CurrentUser() user: User,
	): Promise<IArticleResponse> {
		const article = await this.articlesService.create(input, user);
		return this.articlesService.buildArticleResponse(article);
	}

	@Get(':slug')
	async getArticle(@Param('slug') slug: string): Promise<IArticleResponse> {
		const article = await this.articlesService.findOneBySlug(slug);
		return this.articlesService.buildArticleResponse(article);
	}

	@UseGuards(AuthGuard)
	@Delete(':slug')
	async deleteArticle(
		@Param('slug') slug: string,
		@CurrentUser('id') userId: string,
	): Promise<any> {
		return this.articlesService.delete(slug, userId);
	}

	@UseGuards(AuthGuard)
	@Put(':slug')
	async updateArticle(
		@Body('article') input: UpdateArticleInput,
		@Param('slug') slug: string,
		@CurrentUser('id') userId: string,
	): Promise<IArticleResponse> {
		const article = await this.articlesService.update(slug, userId, input);
		return this.articlesService.buildArticleResponse(article);
	}
}
