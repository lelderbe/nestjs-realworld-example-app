import { User } from '@/users/entities/user.entity';

export class AuthOutput extends User {
	token: string;
}
