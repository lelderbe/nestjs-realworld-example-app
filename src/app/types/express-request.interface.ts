import { Request } from 'express';
import { User } from '@/users/entities/user.entity';

export interface ExpressRequest extends Request {
	user?: User;
}
