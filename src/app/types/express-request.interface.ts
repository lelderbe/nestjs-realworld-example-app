import { Request } from 'express';
import { User } from '@/users/entities/user.entity';

export interface IExpressRequest extends Request {
	user?: User;
}
