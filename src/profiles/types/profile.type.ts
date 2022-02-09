import { UserType } from '@/users/types/user.type';

export type ProfileType = Omit<UserType, 'token'> & {
	following: boolean;
};
