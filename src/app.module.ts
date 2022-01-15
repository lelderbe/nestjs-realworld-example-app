import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TagsModule } from './tags/tags.module';
import { UsersModule } from './users/users.module';
import config from './ormconfig';

@Module({
	imports: [TypeOrmModule.forRoot(config), TagsModule, UsersModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
