import { Article } from '../entities/article.entity';

export type ArticleType = Article & { favorited: boolean };
