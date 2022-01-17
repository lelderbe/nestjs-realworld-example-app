import { Injectable } from '@nestjs/common';
import { CreateArticleInput } from './dto/create-article.input';
import { User } from '@/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArticlesService {
	constructor(
		@InjectRepository(Article)
		private readonly articlesRepository: Repository<Article>,
	) {}

	async create(input: CreateArticleInput, user: User): Promise<Article> {
		console.log('input', input, 'user', user);
		const article = new Article();
		Object.assign(article, input);
		if (!article.tagList) {
			article.tagList = [];
		}
		article.slug = '';
		article.author = user;
		return this.articlesRepository.save(article);
	}
}
