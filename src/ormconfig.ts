import { ConnectionOptions } from 'typeorm';

const config: ConnectionOptions = {
	type: 'postgres',
	host: 'postgres',
	port: 5432,
	username: 'postgres',
	password: process.env.POSTGRES_PASSWORD,
	database: 'conduit',
	entities: [__dirname + '/**/*.entity{.ts,.js}'],
	synchronize: false,
	logging: process.env.NODE_ENV === 'production' ? false : true,
	migrations: ['dist/migrations/*.js'],
	migrationsTransactionMode: 'each',
	cli: {
		migrationsDir: 'migrations',
	},
};

export default config;
