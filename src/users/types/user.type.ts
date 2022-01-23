import { User } from '@/users/entities/user.entity';

export type UserType = Omit<User, 'password' | 'hashPassword'> & {
	token: string;
};
