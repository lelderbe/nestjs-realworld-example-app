import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsModule } from '@/tags/tags.module';
import { User } from '@/users/entities/user.entity';
import { UsersModule } from '@/users/users.module';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { Article } from './entities/article.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([Article, User]),
		TagsModule,
		UsersModule,
	],
	controllers: [ArticlesController],
	providers: [ArticlesService],
})
export class ArticlesModule {}
