import { Strategy } from 'passport-local';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@/users/entities/user.entity';
import { UsersService } from '@/users/users.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private usersService: UsersService) {
		super({
			usernameField: 'user[email]',
			passwordField: 'user[password]',
		});
	}

	async validate(email: string, password: string): Promise<User> {
		// console.log('LocalStrategy validate()');
		const user = await this.usersService.validateUser(email, password);
		return user;
	}
}
