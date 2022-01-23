import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TagsModule } from '@/tags/tags.module';
import { UsersModule } from '@/users/users.module';
import { ArticlesModule } from '@/articles/articles.module';
import config from '../ormconfig';
import { AuthMiddleware } from '@/users/middlewares/auth.middleware';
import { ProfilesModule } from '@/profiles/profiles.module';

@Module({
	imports: [
		TypeOrmModule.forRoot(config),
		TagsModule,
		UsersModule,
		ArticlesModule,
		ProfilesModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(AuthMiddleware)
			.forRoutes({ path: '*', method: RequestMethod.ALL });
	}
}
