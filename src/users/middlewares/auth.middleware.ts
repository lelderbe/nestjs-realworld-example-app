import { verify } from 'jsonwebtoken';
import { IExpressRequest } from '@/types/express-request.interface';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UsersService } from '@/users/users.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
	constructor(private readonly usersService: UsersService) {}

	// use(req: Request, res: Response, next: NextFunction) {
	async use(req: IExpressRequest, res: Response, next: NextFunction) {
		console.log('AuthMiddleware use()');
		req.user = null;
		if (!req.headers.authorization) {
			console.log('user = null');
			next();
			return;
		}

		const token = req.headers.authorization.split(' ')[1];
		try {
			const payload = verify(token, process.env.JWT_SECRET, {
				ignoreExpiration: true, // dev temp
			});
			// TODO !payload?.sub ???
			const user = await this.usersService.findOne(payload.sub);
			req.user = user;
		} catch (err) {
			req.user = null;
		}
		console.log('user =', req.user);
		next();
	}
}
