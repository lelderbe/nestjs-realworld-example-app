import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsModule } from '@/tags/tags.module';
import { User } from '@/users/entities/user.entity';
import { UsersModule } from '@/users/users.module';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { Article } from './entities/article.entity';
import { Comment } from './entities/comment.entity';
import { UsersFavoritesArticles } from './entities/users-favorites-articles.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([Article, User, Comment, UsersFavoritesArticles]),
		TagsModule,
		UsersModule,
	],
	controllers: [ArticlesController],
	providers: [ArticlesService],
})
export class ArticlesModule {}
