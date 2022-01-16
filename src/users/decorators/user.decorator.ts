import {
	BadRequestException,
	createParamDecorator,
	ExecutionContext,
} from '@nestjs/common';

export const CurrentUser = createParamDecorator(
	(data: any, context: ExecutionContext) => {
		const user = context.switchToHttp().getRequest().user;
		if (!user) {
			throw new BadRequestException('Unknown user');
		}
		if (data) {
			return user[data];
		}
		return user;
	},
);
