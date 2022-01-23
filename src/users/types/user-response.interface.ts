import { User } from '@/users/entities/user.entity';
import { UserType } from './user.type';

export interface IUserResponse {
	user: UserType;
}
// export interface IUserResponse {
// 	user: Omit<User, 'id' | 'password' | 'hashPassword'> & { token: string };
// }
