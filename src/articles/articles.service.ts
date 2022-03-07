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
import { ICommentsResponse } from './types/comments-response.interface';

@Injectable()
export class ArticlesService {
	constructor(
		@InjectRepository(Article)
		private readonly articlesRepository: Repository<Article>,
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
		@InjectRepository(Comment)
		private readonly commentsRepository: Repository<Comment>,
		private readonly tagsService: TagsService,
		private readonly usersService: UsersService,
	) {}

	async create(input: CreateArticleInput, user: User): Promise<Article> {
		const article = this.articlesRepository.create(input);
		// TODO use transaction
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

	async findAll(
		filter: FilterArticleInput,
		currentUserId: string,
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
			const favoritedBy =
				// await this.usersService.findOneByNameWithFavorites(
				// 	filter.favorited,
				// );
				await this.usersService.findOne(
					{ username: filter.favorited },
					{ relations: ['favorites'] },
				);
			if (favoritedBy) {
				const ids = favoritedBy.favorites.map((article) => article.id);
				ids.push(null);
				qBuilder = qBuilder.andWhere('articles.id IN (:...ids)', {
					ids,
				});
			}
		}
		qBuilder = qBuilder
			.skip(filter.offset)
			.take(filter.limit)
			.orderBy('articles.createdAt', 'DESC');
		const [articles, articlesCount] = await qBuilder.getManyAndCount();
		return this.buildArticlesResponse(articles, articlesCount, currentUserId);
	}

	async getFeed(
		filter: FilterArticleInput,
		currentUserId: string,
	): Promise<IArticlesResponse> {
		filter.offset = filter.offset ? filter.offset : OFFSET;
		filter.limit = filter.limit ? filter.limit : LIMIT;
		// const user = await this.usersRepository.findOne(
		// 	{ id: currentUserId },
		// 	{ relations: ['follow'] },
		// );
		const user = await this.usersService.findOne(
			{ id: currentUserId },
			{ relations: ['follow'] },
		);
		if (!user) {
			throw new UnauthorizedException('Unauthorized');
		}
		const followIds = user.follow.map((item) => item.id);
		if (!followIds.length) {
			return { articles: [], articlesCount: 0 };
		}

		const qBuilder = this.articlesRepository
			.createQueryBuilder('articles')
			.leftJoinAndSelect('articles.author', 'author')
			.andWhere('author.id IN (:...followIds)', { followIds })
			.skip(filter.offset)
			.take(filter.limit)
			.orderBy('articles.createdAt', 'DESC');
		const [articles, articlesCount] = await qBuilder.getManyAndCount();
		return this.buildArticlesResponse(articles, articlesCount, currentUserId);
	}

	async update(
		slug: string,
		currentUserId: string,
		input: UpdateArticleInput,
	): Promise<Article> {
		const article = await this.findArticleBySlug(slug);
		if (article.author.id !== currentUserId) {
			throw new ForbiddenException('You are not owner of this article');
		}
		Object.assign(article, input);
		if (input.title) {
			article.slug = this.getSlug(article.title);
		}
		return this.articlesRepository.save(article);
	}

	async remove(slug: string, currentUserId: string): Promise<Article> {
		const article = await this.findArticleBySlug(slug);
		if (article.author.id !== currentUserId) {
			throw new ForbiddenException('You are not owner of this article');
		}
		return this.articlesRepository.softRemove(article);
	}

	async addArticleToFavorites(slug: string, currentUserId: string): Promise<Article> {
		const article = await this.findArticleBySlug(slug);
		// TODO use transaction
		const success = await this.usersService.addArticleToFavorites(
			currentUserId,
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
		currentUserId: string,
	): Promise<Article> {
		const article = await this.findArticleBySlug(slug);
		// TODO use transaction
		const success = await this.usersService.removeArticleFromFavorites(
			currentUserId,
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

		return slugify(title, { lower: true }) + getRandomPart();
	}

	private async getArticleResponse(
		article: Article,
		user: User,
	): Promise<IArticleResponse> {
		let favorited = false;
		let following = false;
		if (user) {
			if (user.favorites.find((item) => item.id === article.id)) {
				favorited = true;
			}
			if (user.follow.find((item) => item.id === article.author.id)) {
				following = true;
			}
		}
		article.author['following'] = following;
		delete article.author.id;
		delete article.author.email;
		delete article.id;
		delete article.deletedAt;
		return { article: { ...article, favorited: favorited } };
	}

	async buildArticleResponse(
		article: Article,
		currentUserId: string,
	): Promise<IArticleResponse> {
		// const user = await this.usersService.findOneByIdWithFavoritesAndFollow(
		// 	currentUserId,
		// );
		const user = await this.usersService.findOne(
			{ id: currentUserId },
			{ relations: ['favorites', 'follow'] },
		);
		return this.getArticleResponse(article, user);
	}

	async buildArticlesResponse(
		articles: Article[],
		articlesCount: number,
		currentUserId: string,
	): Promise<IArticlesResponse> {
		// const user = await this.usersService.findOneByIdWithFavoritesAndFollow(
		// 	currentUserId,
		// );
		const user = await this.usersService.findOne(
			{ id: currentUserId },
			{ relations: ['favorites', 'follow'] },
		);
		const articlesWithFav: ArticleType[] = await Promise.all(
			articles.map(async (article) => {
				const result = await this.getArticleResponse(article, user);
				return { ...result.article };
			}),
		);
		return { articles: articlesWithFav, articlesCount };
	}

	async addCommentToArticle(
		slug: string,
		input: CreateCommentInput,
		currentUserId: string,
	): Promise<Comment> {
		const article = await this.findArticleBySlug(slug);
		// const user = await this.usersService.findOne(currentUserId);
		const user = await this.usersService.findOne({ id: currentUserId });
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

	async getArticleComments(
		slug: string,
		currentUserId: string,
	): Promise<ICommentsResponse> {
		const qBuilder = this.commentsRepository
			.createQueryBuilder('comments')
			.leftJoinAndSelect('comments.article', 'article')
			.leftJoinAndSelect('comments.author', 'author')
			.andWhere('article.slug = :slug', { slug })
			.orderBy('comments.createdAt', 'DESC');
		const [comments, commentsCount] = await qBuilder.getManyAndCount();
		return this.buildCommentsResponse(comments, commentsCount, currentUserId);
	}

	async removeCommentFromArticle(
		slug: string,
		commentId: string,
		currentUserId: string,
	): Promise<Comment> {
		const qBuilder = this.commentsRepository
			.createQueryBuilder('comments')
			.leftJoinAndSelect('comments.article', 'article')
			.leftJoinAndSelect('comments.author', 'author')
			.andWhere('article.slug = :slug', { slug })
			.andWhere('comments.id = :commentId', { commentId });
		const comment = await qBuilder.getOne();
		if (!comment) {
			throw new NotFoundException('Comment not found');
		}
		if (comment.author.id !== currentUserId) {
			throw new ForbiddenException('You are not owner of this comment');
		}
		return this.commentsRepository.softRemove(comment);
	}

	private async getCommentResponse(
		comment: Comment,
		user: User,
	): Promise<ICommentResponse> {
		let following = false;
		if (user) {
			if (user.follow.find((item) => item.id === comment.author.id)) {
				following = true;
			}
		}
		comment.author['following'] = following;
		delete comment.article;
		delete comment.author.id;
		delete comment.author.email;
		delete comment.deletedAt;
		return { comment: { ...comment } };
	}

	async buildCommentResponse(
		comment: Comment,
		currentUserId: string,
	): Promise<ICommentResponse> {
		// const user = await this.usersService.findOneByIdWithFavoritesAndFollow(
		// 	currentUserId,
		// );
		const user = await this.usersService.findOne(
			{ id: currentUserId },
			{ relations: ['favorites', 'follow'] },
		);
		return this.getCommentResponse(comment, user);
	}

	async buildCommentsResponse(
		comments: Comment[],
		commentsCount: number,
		currentUserId: string,
	): Promise<ICommentsResponse> {
		// const user = await this.usersService.findOneByIdWithFavoritesAndFollow(
		// 	currentUserId,
		// );
		const user = await this.usersService.findOne(
			{ id: currentUserId },
			{ relations: ['favorites', 'follow'] },
		);
		const commentsRes = await Promise.all(
			comments.map(async (item) => {
				const result = await this.getCommentResponse(item, user);
				return { ...result.comment };
			}),
		);
		return { comments: commentsRes };
	}
}
