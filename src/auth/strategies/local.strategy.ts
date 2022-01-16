import { Strategy } from 'passport-local';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '@/auth/auth.service';
import { User } from '@/users/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private authService: AuthService) {
		super({
			usernameField: 'user[email]',
			passwordField: 'user[password]',
		});
	}

	async validate(email: string, password: string): Promise<User> {
		console.log('LocalStrategy validate()');
		const user = await this.authService.validateUser(email, password);
		// if (!user) {
		// 	throw new UnauthorizedException('Invalid credentials');
		// }
		return user;
		// return null;
	}
}
