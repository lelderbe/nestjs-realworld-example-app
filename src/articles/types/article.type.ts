import { Article } from '@/articles/entities/article.entity';

export type ArticleType = Article & { favorited: boolean };
