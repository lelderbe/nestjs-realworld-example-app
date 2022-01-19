import { TagsModule } from '@/tags/tags.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { Article } from './entities/article.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Article]), TagsModule],
	controllers: [ArticlesController],
	providers: [ArticlesService],
})
export class ArticlesModule {}
