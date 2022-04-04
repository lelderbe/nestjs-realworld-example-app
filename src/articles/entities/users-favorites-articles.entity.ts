import { Entity, PrimaryColumn } from 'typeorm';

@Entity('users_favorites_articles')
export class UsersFavoritesArticles {
	@PrimaryColumn('uuid')
	usersId: string;

	@PrimaryColumn('uuid')
	articlesId: string;
}
