import { User } from '@/users/entities/user.entity';
import { ProfileType } from './profile.type';

export interface IProfileResponse {
	profile: ProfileType;
}
// export interface IProfileResponse {
// 	profile: Omit<
// 		User,
// 		'id' | 'password' | 'hashPassword' | 'email' | 'favorites'
// 	> & {
// 		following: boolean;
// 	};
// }
