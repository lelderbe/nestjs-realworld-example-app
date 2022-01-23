import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/users/entities/user.entity';
import { IProfileResponse } from './types/profile-response.interface';
import { ProfileType } from './types/profile.type';
import { UserType } from '@/users/types/user.type';

@Injectable()
export class ProfilesService {
	constructor(
		@InjectRepository(User) private readonly usersRepo: Repository<User>,
	) {}

	async getProfile(
		profileUsername: string,
		currentUserId: string,
	): Promise<ProfileType> {
		const user = await this.usersRepo.findOne({
			username: profileUsername,
		});
		if (!user) {
			throw new NotFoundException('Profile not found');
		}
		let following = false;
		const follower = await this.usersRepo.findOne(
			{ id: currentUserId },
			{ relations: ['follow'] },
		);
		if (follower && follower.follow.find((item) => item.id === user.id)) {
			following = true;
		}
		return { ...user, following };
	}

	async followProfile(
		profileUsername: string,
		currentUserId: string,
	): Promise<ProfileType> {
		const { user, follower } = await this.getProfileAndFollower(
			profileUsername,
			currentUserId,
		);
		if (!follower.follow.find((item) => item.id === user.id)) {
			follower.follow.push(user);
			await this.usersRepo.save(follower);
		}
		return { ...user, following: true };
	}

	async unfollowProfile(
		profileUsername: string,
		currentUserId: string,
	): Promise<ProfileType> {
		const { user, follower } = await this.getProfileAndFollower(
			profileUsername,
			currentUserId,
		);
		const index = follower.follow.findIndex((item) => item.id === user.id);
		if (index !== -1) {
			console.log('index', index);
			follower.follow.splice(index, 1);
			await this.usersRepo.save(follower);
		}
		return { ...user, following: false };
	}

	private async getProfileAndFollower(
		profileUsername: string,
		currentUserId: string,
	): Promise<{ user: User; follower: User }> {
		const user = await this.usersRepo.findOne({
			username: profileUsername,
		});
		if (!user) {
			throw new NotFoundException('Profile not found');
		}
		if (user.id === currentUserId) {
			throw new BadRequestException('Unable to follow yourself');
		}
		const follower = await this.usersRepo.findOne(
			{ id: currentUserId },
			{ relations: ['follow'] },
		);
		if (!follower) {
			throw new UnauthorizedException('Unauthorized');
		}
		return { user: user, follower: follower };
	}

	async buildProfileResponse(
		profile: ProfileType,
	): Promise<IProfileResponse> {
		// const { password, email, favorites, ...rest } = profile;
		// const { email, favorites, ...rest } = profile;
		delete profile.email;
		delete profile.favorites;
		// const { ...rest } = profile;
		return {
			profile: { ...profile },
		};
	}
}
