import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '@/users/decorators/user.decorator';
import { User } from '@/users/entities/user.entity';
import { JwtAuthGuard } from '@/users/guards/jwt-auth.guard';
import { ArticlesService } from './articles.service';
import { CreateArticleInput } from './dto/create-article.input';
import { IArticleResponse } from './types/article-response.interface';

@Controller('articles')
export class ArticlesController {
	constructor(private readonly articlesService: ArticlesService) {}

	@UseGuards(JwtAuthGuard)
	@Post()
	async create(
		@Body('article') input: CreateArticleInput,
		@CurrentUser() user: User,
	): Promise<IArticleResponse> {
		const article = await this.articlesService.create(input, user);
		return this.articlesService.buildArticleResponse(article);
	}
}
