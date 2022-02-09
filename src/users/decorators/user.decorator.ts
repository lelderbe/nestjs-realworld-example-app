import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IExpressRequest } from '@/app/types/express-request.interface';

export const CurrentUser = createParamDecorator(
	(data: any, context: ExecutionContext) => {
		const user = context.switchToHttp().getRequest<IExpressRequest>().user;
		if (!user) {
			return null;
		}
		if (data) {
			return user[data];
		}
		return user;
	},
);
