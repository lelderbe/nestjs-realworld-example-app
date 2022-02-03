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
import { FilterArticleInput } from './dto/filter-article.input';
import { CreateCommentInput } from './dto/create-comment.input';

@Controller('articles')
export class ArticlesController {
	constructor(private readonly articlesService: ArticlesService) {}

	@Get()
	async findAll(
		@Query() filter: FilterArticleInput,
		@CurrentUser('id') userId: string,
	): Promise<IArticlesResponse> {
		return this.articlesService.findAll(filter, userId);
	}

	@UseGuards(AuthGuard)
	@Get('feed')
	async getFeed(
		@Query() filter: FilterArticleInput,
		@CurrentUser('id') userId: string,
	) {
		return this.articlesService.getFeed(filter, userId);
	}

	@UseGuards(AuthGuard)
	@Post()
	async createArticle(
		@Body('article') input: CreateArticleInput,
		@CurrentUser() user: User,
	): Promise<IArticleResponse> {
		const article = await this.articlesService.create(input, user);
		return this.articlesService.buildArticleResponse(article, user.id);
	}

	@Get(':slug')
	async getArticle(
		@Param('slug') slug: string,
		@CurrentUser('id') userId: string,
	): Promise<IArticleResponse> {
		const article = await this.articlesService.findArticleBySlug(slug);
		return this.articlesService.buildArticleResponse(article, userId);
	}

	@UseGuards(AuthGuard)
	@Delete(':slug')
	async deleteArticle(
		@Param('slug') slug: string,
		@CurrentUser('id') userId: string,
	): Promise<void> {
		await this.articlesService.remove(slug, userId);
	}

	@UseGuards(AuthGuard)
	@Put(':slug')
	async updateArticle(
		@Body('article') input: UpdateArticleInput,
		@Param('slug') slug: string,
		@CurrentUser('id') userId: string,
	): Promise<IArticleResponse> {
		const article = await this.articlesService.update(slug, userId, input);
		return this.articlesService.buildArticleResponse(article, userId);
	}

	@UseGuards(AuthGuard)
	@Post(':slug/favorite')
	async addArticleToFavorites(
		@Param('slug') slug: string,
		@CurrentUser('id') userId: string,
	): Promise<IArticleResponse> {
		const article = await this.articlesService.addArticleToFavorites(
			slug,
			userId,
		);
		return this.articlesService.buildArticleResponse(article, userId);
	}

	@UseGuards(AuthGuard)
	@Delete(':slug/favorite')
	async removeArticleFromFavorites(
		@Param('slug') slug: string,
		@CurrentUser('id') userId: string,
	): Promise<IArticleResponse> {
		const article = await this.articlesService.removeArticleFromFavorites(
			slug,
			userId,
		);
		return this.articlesService.buildArticleResponse(article, userId);
	}

	@UseGuards(AuthGuard)
	@Post(':slug/comments')
	async addCommentToArticle(
		@Param('slug') slug: string,
		@Body('comment') input: CreateCommentInput,
		@CurrentUser('id') userId: string,
	): Promise<any> {
		const comment = await this.articlesService.addCommentToArticle(
			slug,
			input,
			userId,
		);
		return this.articlesService.buildCommentResponse(comment, userId);
	}

	@Get(':slug/comments')
	async getArticleComments(
		@Param('slug') slug: string,
		@CurrentUser('id') userId: string,
	): Promise<any> {
		return this.articlesService.getArticleComments(slug, userId);
		// const article = await this.articlesService.findOneBySlug(slug);
		// return this.articlesService.buildArticleResponse(article, userId);
	}

	@UseGuards(AuthGuard)
	@Delete(':slug/comments/:id')
	async removeCommentFromArticle(
		@Param('slug') slug: string,
		@Param('id') commentId: string,
		@CurrentUser('id') userId: string,
	): Promise<any> {
		return this.articlesService.removeCommentFromArticle(
			slug,
			commentId,
			userId,
		);
		// return this.articlesService.buildArticleResponse(article, userId);
	}
}
