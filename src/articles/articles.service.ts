import {
	ForbiddenException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import slugify from 'slugify';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateArticleInput } from './dto/create-article.input';
import { User } from '@/users/entities/user.entity';
import { Article } from './entities/article.entity';
import { UpdateArticleInput } from './dto/update-article.input';
import { IArticleResponse } from './types/article-response.interface';
import { IArticlesResponse } from './types/articles-response.interface';
import { TagsService } from '@/tags/tags.service';
import { FilterArticleInput } from './dto/filter-article.input';
import { LIMIT, OFFSET } from '@/app/constants';
import { UsersService } from '@/users/users.service';
import { ArticleType } from './types/article.type';
import { CreateCommentInput } from './dto/create-comment.input';
import { Comment } from './entities/comment.entity';
import { ICommentResponse } from './types/comment-response.interface';

@Injectable()
export class ArticlesService {
	constructor(
		@InjectRepository(Article)
		private readonly articlesRepository: Repository<Article>,
		@InjectRepository(User) private readonly usersRepo: Repository<User>,
		@InjectRepository(Comment)
		private readonly commentsRepository: Repository<Comment>,
		private readonly tagsService: TagsService,
		private readonly usersService: UsersService,
	) {}

	async create(input: CreateArticleInput, user: User): Promise<Article> {
		const article = this.articlesRepository.create(input);
		// const article = new Article();
		// Object.assign(article, input);
		// const article = Object.assign(new Article(), input);
		if (article.tagList) {
			article.tagList.forEach((title) => {
				this.tagsService.createIfNotExists(title);
			});
		}
		article.slug = this.getSlug(article.title);
		article.author = user;
		return this.articlesRepository.save(article);
	}

	async findArticleBySlug(slug: string): Promise<Article> {
		const article = await this.articlesRepository.findOne({ slug });
		if (!article) {
			throw new NotFoundException('Article does not exist');
		}
		return article;
	}

	// async findArticleByTitle(title: string): Promise<Article> {
	// 	const article = await this.articlesRepository.findOne({ title });
	// 	if (!article) {
	// 		throw new NotFoundException('Article does not exist');
	// 	}
	// 	return article;
	// }

	async findAll(
		filter: FilterArticleInput,
		userId: string,
	): Promise<IArticlesResponse> {
		filter.offset = filter.offset ? filter.offset : OFFSET;
		filter.limit = filter.limit ? filter.limit : LIMIT;
		// let qBuilder = getRepository(Article).createQueryBuilder('articles');
		let qBuilder = this.articlesRepository
			.createQueryBuilder('articles')
			.leftJoinAndSelect('articles.author', 'author');
		if (filter.author) {
			qBuilder = qBuilder.andWhere('author.username = :authorUsername', {
				authorUsername: filter.author,
			});
		}
		if (filter.tag) {
			qBuilder = qBuilder.andWhere(':tag = ANY (articles.tagList)', {
				tag: filter.tag,
			});
		}
		if (filter.favorited) {
			const user = await this.usersService.findOneByNameWithFavorites(
				filter.favorited,
			);
			if (user) {
				const ids = user.favorites.map((article) => article.id);
				ids.push(null);
				qBuilder = qBuilder.andWhere('articles.id IN (:...ids)', {
					ids,
				});
			}
		}
		qBuilder = qBuilder
			.skip(filter.offset)
			.take(filter.limit)
			.orderBy('articles.updatedAt', 'DESC');
		const [articles, articlesCount] = await qBuilder.getManyAndCount();
		return this.buildArticlesResponse(articles, articlesCount, userId);
	}

	async getFeed(
		filter: FilterArticleInput,
		userId: string,
	): Promise<IArticlesResponse> {
		filter.offset = filter.offset ? filter.offset : OFFSET;
		filter.limit = filter.limit ? filter.limit : LIMIT;
		console.log('filter', filter);
		const user = await this.usersRepo.findOne(
			{ id: userId },
			{ relations: ['follow'] },
		);
		if (!user) {
			throw new UnauthorizedException('Unauthorized');
		}
		const followIds = user.follow.map((item) => item.id);
		if (!followIds) {
			return { articles: [], articlesCount: 0 };
		}

		const qBuilder = this.articlesRepository
			.createQueryBuilder('articles')
			.leftJoinAndSelect('articles.author', 'author')
			.andWhere('author.id IN (:...followIds)', { followIds })
			.skip(filter.offset)
			.take(filter.limit)
			.orderBy('articles.updatedAt', 'DESC');
		const [articles, articlesCount] = await qBuilder.getManyAndCount();
		return this.buildArticlesResponse(articles, articlesCount, userId);
	}

	async update(
		slug: string,
		userId: string,
		input: UpdateArticleInput,
	): Promise<Article> {
		const article = await this.findArticleBySlug(slug);
		if (article.author.id !== userId) {
			throw new ForbiddenException('You are not owner of this article');
		}
		Object.assign(article, input);
		if (input.title) {
			article.slug = this.getSlug(article.title);
		}
		return this.articlesRepository.save(article);
	}

	async remove(slug: string, userId: string): Promise<Article> {
		const article = await this.findArticleBySlug(slug);
		if (article.author.id !== userId) {
			throw new ForbiddenException('You are not owner of this article');
		}
		return this.articlesRepository.softRemove(article);
	}

	async addArticleToFavorites(
		slug: string,
		userId: string,
	): Promise<Article> {
		const article = await this.findArticleBySlug(slug);
		const success = await this.usersService.addArticleToFavorites(
			userId,
			article,
		);
		if (success) {
			article.favoritesCount++;
			return this.articlesRepository.save(article);
		}
		return article;
	}

	async removeArticleFromFavorites(
		slug: string,
		userId: string,
	): Promise<Article> {
		const article = await this.findArticleBySlug(slug);
		const success = await this.usersService.removeArticleFromFavorites(
			userId,
			article,
		);
		if (success && article.favoritesCount > 0) {
			article.favoritesCount--;
			return this.articlesRepository.save(article);
		}
		return article;
	}

	private getSlug(title: string): string {
		function getRandomPart(): string {
			return '-' + ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
		}

		// return slugify(title, { lower: true });
		return slugify(title, { lower: true }) + getRandomPart();
	}

	async buildArticleResponse(
		article: Article,
		currentUserId: string,
	): Promise<IArticleResponse> {
		let favorited = false;
		if (currentUserId) {
			const user = await this.usersService.findOneByIdWithFavorites(
				currentUserId,
			);
			favorited =
				user &&
				user.favorites.map((item) => item.id).includes(article.id);
			// if (
			// 	user &&
			// 	user.favorites.map((item) => item.id).includes(article.id)
			// ) {
			// 	favorited = true;
			// }
		}
		return { article: { ...article, favorited: favorited } };
	}

	async buildArticlesResponse(
		articles: Article[],
		articlesCount: number,
		currentUserId: string,
	): Promise<IArticlesResponse> {
		let favoritedIds = [];
		if (currentUserId) {
			const user = await this.usersService.findOneByIdWithFavorites(
				currentUserId,
			);
			if (user) {
				favoritedIds = user.favorites.map((item) => item.id);
			}
		}

		const articlesWithFav: ArticleType[] = articles.map((article) => {
			return { ...article, favorited: favoritedIds.includes(article.id) };
		});

		return { articles: articlesWithFav, articlesCount };
	}

	async addCommentToArticle(
		slug: string,
		input: CreateCommentInput,
		userId: string,
	): Promise<Comment> {
		const article = await this.findArticleBySlug(slug);
		const user = await this.usersService.findOne(userId);
		if (!user) {
			throw new UnauthorizedException('Not authorized');
		}
		const comment = this.commentsRepository.create({
			...input,
			article,
			author: user,
		});
		console.log('comment:', comment);
		return this.commentsRepository.save(comment);
	}

	async getArticleComments(slug: string, userId: string) {
		const qBuilder = this.commentsRepository
			.createQueryBuilder('comments')
			.leftJoinAndSelect('comments.article', 'article')
			.leftJoinAndSelect('comments.author', 'author')
			.andWhere('article.slug = :slug', { slug })
			.orderBy('comments.updatedAt', 'ASC');

		const [comments, commentsCount] = await qBuilder.getManyAndCount();
		return this.buildCommentsResponse(comments, commentsCount, userId);
	}

	async removeCommentFromArticle(
		slug: string,
		commentId: string,
		userId: string,
	) {
		const qBuilder = this.commentsRepository
			.createQueryBuilder('comments')
			.leftJoinAndSelect('comments.article', 'article')
			.leftJoinAndSelect('comments.author', 'author')
			.andWhere('comments.id = :commentId', { commentId })
			.andWhere('article.slug = :slug', { slug });
		const comment = await qBuilder.getOne();
		console.log('comment:', comment);
		if (!comment) {
			throw new NotFoundException('Comment not found');
		}
		if (comment.author.id !== userId) {
			throw new ForbiddenException('You are not owner of this comment');
		}
		return this.commentsRepository.softRemove(comment);
	}

	buildCommentResponse(
		comment: Comment,
		currentUserId: string,
	): ICommentResponse {
		delete comment.article;
		delete comment.author.email;
		return { comment };
	}

	async buildCommentsResponse(
		comments: Comment[],
		commentsCount: number,
		currentUserId: string,
	): Promise<any> {
		comments = comments.map((item) => {
			const elem = this.buildCommentResponse(item, currentUserId);
			return elem.comment;
		});
		return { comments };
	}
}
