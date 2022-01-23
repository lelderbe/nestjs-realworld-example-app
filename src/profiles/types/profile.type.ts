import { UserType } from '@/users/types/user.type';

// export type ProfileType = Omit<UserType, 'email' | 'favorites' | 'token'> & {
export type ProfileType = Omit<UserType, 'token'> & {
	following: boolean;
};
