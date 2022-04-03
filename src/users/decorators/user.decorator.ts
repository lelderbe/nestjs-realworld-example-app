import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ExpressRequest } from '@/app/types/express-request.interface';

export const CurrentUser = createParamDecorator(
	(data: any, context: ExecutionContext) => {
		const user = context.switchToHttp().getRequest<ExpressRequest>().user;

		if (!user) {
			return null;
		}

		return data ? user[data] : user;
	},
);
