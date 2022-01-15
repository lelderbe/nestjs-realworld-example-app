import { Module } from '@nestjs/common';
import { TagsController } from '@/tags/tags.controller';
import { TagsService } from '@/tags/tags.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Tag])],
	controllers: [TagsController],
	providers: [TagsService],
})
export class TagsModule {}
