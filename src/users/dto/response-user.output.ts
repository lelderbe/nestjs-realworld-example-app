import { IsString } from 'class-validator';

export class ResponseUserOutput {
	// id: string;
	@IsString()
	username: string;

	@IsString()
	email: string;

	@IsString()
	bio: string;

	@IsString()
	image: string;

	@IsString()
	token: string;
}
