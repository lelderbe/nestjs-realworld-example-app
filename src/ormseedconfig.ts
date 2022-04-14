import { ConnectionOptions } from 'typeorm';
import ormconfig from './ormconfig';

const config: ConnectionOptions = {
	...ormconfig,
	migrations: ['dist/seeds/*.js'],
	cli: {
		migrationsDir: 'seeds',
	},
};

export default config;
