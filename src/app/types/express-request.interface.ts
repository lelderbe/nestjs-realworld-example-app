import { User } from '@/users/entities/user.entity';
import { Request } from 'express';

export interface IExpressRequest extends Request {
	user?: User;
}
