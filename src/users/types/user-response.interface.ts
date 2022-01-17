import { User } from '@/users/entities/user.entity';
import { UserType } from './user.type';

export interface IUserResponse {
	user: Omit<User, 'id' | 'password'> & { token: string };
	// user: Omit<UserType, 'id' | 'password'> & { token: string };
}
