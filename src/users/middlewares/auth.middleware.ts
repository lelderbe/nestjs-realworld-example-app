import { verify } from 'jsonwebtoken';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { IExpressRequest } from '@/app/types/express-request.interface';
import { UsersService } from '@/users/users.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
	constructor(private readonly usersService: UsersService) {}

	async use(req: IExpressRequest, res: Response, next: NextFunction) {
		req.user = null;
		if (!req.headers.authorization) {
			next();
			return;
		}

		const token = req.headers.authorization.split(' ')[1];
		try {
			const payload = verify(token, process.env.JWT_SECRET, {
				ignoreExpiration:
					process.env.NODE_ENV === 'production' ? false : true,
			});
			const user = await this.usersService.findOne(payload?.sub);
			req.user = user ? user : null;
		} catch (err) {
			req.user = null;
		}
		next();
	}
}
