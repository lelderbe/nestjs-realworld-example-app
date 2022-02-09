import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { IExpressRequest } from '@/app/types/express-request.interface';

@Injectable()
export class AuthGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest<IExpressRequest>();
		if (request.user) {
			return true;
		}
		throw new UnauthorizedException('Not authorized');
	}
}
