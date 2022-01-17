import { IExpressRequest } from '@/types/express-request.interface';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
	(data: any, context: ExecutionContext) => {
		// TODO: describe : User ?
		const user = context.switchToHttp().getRequest<IExpressRequest>().user;
		if (!user) {
			return null;
			// throw new UnprocessableEntityException('Unknown user');
		}
		if (data) {
			return user[data];
		}
		return user;
	},
);
