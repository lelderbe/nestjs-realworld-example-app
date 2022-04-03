import { Article } from '@/articles/entities/article.entity';

export type ArticleType = Omit<Article, 'deletedAt' | 'comments' | 'favoritedBy'>;
