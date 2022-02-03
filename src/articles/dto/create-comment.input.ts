import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentInput {
	@IsNotEmpty()
	@IsString()
	body: string;
}
