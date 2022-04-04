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
import { ArticleResponse } from './types/article-response.interface';
import { UpdateArticleInput } from './dto/update-article.input';
import { AuthGuard } from '@/users/guards/auth.guard';
import { ArticlesResponse } from './types/articles-response.interface';
import { FilterArticleInput } from './dto/filter-article.input';
import { CreateCommentInput } from './dto/create-comment.input';
import { CommentsResponse } from './types/comments-response.interface';
import { CommentResponse } from './types/comment-response.interface';
import { PaginateFilterInput } from '@/app/dto/paginate-filter.input';

@Controller('articles')
export class ArticlesController {
	constructor(private readonly articlesService: ArticlesService) {}

	@Get()
	async findAll(
		@Query() input: FilterArticleInput,
		@CurrentUser('id') userId: string,
	): Promise<ArticlesResponse> {
		return this.articlesService.findAll(input, userId);
	}

	@UseGuards(AuthGuard)
	@Get('feed')
	async getFeed(
		@Query() input: PaginateFilterInput,
		@CurrentUser('id') userId: string,
	): Promise<ArticlesResponse> {
		return this.articlesService.getFeed(input, userId);
	}

	@UseGuards(AuthGuard)
	@Post()
	async createArticle(
		@Body('article') input: CreateArticleInput,
		@CurrentUser() user: User,
	): Promise<ArticleResponse> {
		const article = await this.articlesService.create(input, user);
		return this.articlesService.buildArticleResponse(article, user.id);
	}

	@Get(':slug')
	async getArticle(
		@Param('slug') slug: string,
		@CurrentUser('id') userId: string,
	): Promise<ArticleResponse> {
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
		@Param('slug') slug: string,
		@Body('article') input: UpdateArticleInput,
		@CurrentUser('id') userId: string,
	): Promise<ArticleResponse> {
		const article = await this.articlesService.update(slug, input, userId);
		return this.articlesService.buildArticleResponse(article, userId);
	}

	@UseGuards(AuthGuard)
	@Post(':slug/favorite')
	async addArticleToFavorites(
		@Param('slug') slug: string,
		@CurrentUser('id') userId: string,
	): Promise<ArticleResponse> {
		const article = await this.articlesService.addArticleToFavorites(slug, userId);
		return this.articlesService.buildArticleResponse(article, userId);
	}

	@UseGuards(AuthGuard)
	@Delete(':slug/favorite')
	async removeArticleFromFavorites(
		@Param('slug') slug: string,
		@CurrentUser('id') userId: string,
	): Promise<ArticleResponse> {
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
	): Promise<CommentResponse> {
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
	): Promise<CommentsResponse> {
		return this.articlesService.getArticleComments(slug, userId);
	}

	@UseGuards(AuthGuard)
	@Delete(':slug/comments/:id')
	async removeCommentFromArticle(
		@Param('slug') slug: string,
		@Param('id') commentId: string,
		@CurrentUser('id') userId: string,
	): Promise<void> {
		this.articlesService.removeCommentFromArticle(slug, commentId, userId);
	}
}
