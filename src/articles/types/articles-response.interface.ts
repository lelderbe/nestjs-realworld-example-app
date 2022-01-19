import { Article } from '@/articles/entities/article.entity';

export interface IArticlesResponse {
	articles: Article[];
	articlesCount: number;
}
