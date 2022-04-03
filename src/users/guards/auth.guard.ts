import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { ExpressRequest } from '@/app/types/express-request.interface';
import { NOT_AUTHORIZED } from '@/app/constants';

@Injectable()
export class AuthGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest<ExpressRequest>();

		if (request.user) {
			return true;
		}

		throw new UnauthorizedException(NOT_AUTHORIZED);
	}
}
