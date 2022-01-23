import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app/app.module';
import { ValidationPipe } from './app/pipes/validation.pipe';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix('api');
	app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
	// app.useGlobalFilters(new HttpExceptionFilter()); // catch HttpExceptions before response
	await app.listen(3000);
}
bootstrap();
