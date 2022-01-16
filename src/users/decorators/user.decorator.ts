import {
	createParamDecorator,
	ExecutionContext,
	UnprocessableEntityException,
} from '@nestjs/common';

export const CurrentUser = createParamDecorator(
	(data: any, context: ExecutionContext) => {
		// TODO: describe : User ?
		const user = context.switchToHttp().getRequest().user;
		if (!user) {
			throw new UnprocessableEntityException('Unknown user');
		}
		if (data) {
			return user[data];
		}
		return user;
	},
);
