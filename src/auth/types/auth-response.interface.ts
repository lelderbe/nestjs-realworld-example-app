import { User } from '@/users/entities/user.entity';

export interface IAuthResponse {
	user: Omit<User, 'id' | 'password'> & { token: string };
}
