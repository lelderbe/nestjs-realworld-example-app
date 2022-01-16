import { User } from '@/users/entities/user.entity';
import { IAuthResponse } from '../types/auth-response.interface';

// export class AuthOutput implements IAuthResponse {
export class AuthOutput extends User {
	token: string;
}
