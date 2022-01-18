import { User } from '@/users/entities/user.entity';

export interface IUserResponse {
	user: Omit<User, 'id' | 'password' | 'hashPassword'> & { token: string };
}
