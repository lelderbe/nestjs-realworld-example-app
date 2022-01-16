import { User } from '@/users/entities/user.entity';

export class UserResponse extends User {
	token: string;
}
