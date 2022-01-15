import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { User } from '@/users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly usersService: UsersService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			// ignoreExpiration: false,
			ignoreExpiration: true, // temp for dev
			secretOrKey: process.env.JWT_SECRET,
		});
	}

	async validate(payload: any): Promise<User> {
		// additional checks
		// if (!payload?.sub) {
		// 	throw new UnauthorizedException('Invalid credentials');
		// }
		// try {
		// 	const user = await this.usersService.findOne(payload.sub);
		// 	if (!user) {
		// 		throw new UnauthorizedException('Invalid credentials');
		// 	}
		// 	return user;
		// } catch (error) {
		// 	throw new UnauthorizedException('Invalid credentials');
		// }
		return null;
	}
}
