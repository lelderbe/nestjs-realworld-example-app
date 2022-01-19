import { ConnectionOptions } from 'typeorm';
// import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const config: ConnectionOptions = {
	type: process.env.TYPEORM_CONNECTION as 'postgres' | 'mysql',
	host: process.env.TYPEORM_HOST,
	port: +process.env.TYPEORM_PORT,
	username: process.env.TYPEORM_USERNAME,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.TYPEORM_DATABASE,
	// entities: ['dist/**/*.entity{.ts,.js}'],
	entities: [__dirname + '/**/*.entity{.ts,.js}'],
	synchronize: false,
	logging: true,
	migrations: ['dist/migrations/*.js'],
	// migrations: ['dist/migrations/*.js', 'migrations/*.ts'],
	// migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
	migrationsTransactionMode: 'each',
	cli: {
		migrationsDir: 'migrations',
	},
	// namingStrategy: new SnakeNamingStrategy(),
};

export default config;
