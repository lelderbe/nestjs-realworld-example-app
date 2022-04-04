import {
	Injectable,
	NotFoundException,
	UnauthorizedException,
	UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/users/entities/user.entity';
import { ProfileResponse } from './types/profile-response.interface';
import { ProfileType } from './types/profile.type';
import { NOT_AUTHORIZED, PROFILE_NOT_FOUND, UNABLE_FOLLOW_SELF } from '@/app/constants';

@Injectable()
export class ProfilesService {
	constructor(
		@InjectRepository(User) private readonly usersRepository: Repository<User>,
	) {}

	async getProfile(
		profileUsername: string,
		currentUserId: string,
	): Promise<ProfileType> {
		const profile = await this.usersRepository.findOne({ username: profileUsername });
		if (!profile) {
			throw new NotFoundException(PROFILE_NOT_FOUND);
		}
		let following = false;
		if (currentUserId) {
			const follower = await this.usersRepository.findOne(
				{ id: currentUserId },
				{ relations: ['follow'] },
			);
			if (follower && follower.follow.find((item) => item.id === profile.id)) {
				following = true;
			}
		}
		return { ...profile, following };
	}

	async followProfile(
		profileUsername: string,
		currentUserId: string,
	): Promise<ProfileType> {
		const { profile, currentUser } = await this.getProfileAndCurrentUser(
			profileUsername,
			currentUserId,
		);
		if (!currentUser.follow.find((item) => item.id === profile.id)) {
			currentUser.follow.push(profile);
			await this.usersRepository.save(currentUser);
		}
		return { ...profile, following: true };
	}

	async unfollowProfile(
		profileUsername: string,
		currentUserId: string,
	): Promise<ProfileType> {
		const { profile, currentUser } = await this.getProfileAndCurrentUser(
			profileUsername,
			currentUserId,
		);
		const index = currentUser.follow.findIndex((item) => item.id === profile.id);
		if (index !== -1) {
			currentUser.follow.splice(index, 1);
			await this.usersRepository.save(currentUser);
		}
		return { ...profile, following: false };
	}

	private async getProfileAndCurrentUser(
		profileUsername: string,
		currentUserId: string,
	): Promise<{ profile: User; currentUser: User }> {
		const profile = await this.usersRepository.findOne({
			username: profileUsername,
		});
		if (!profile) {
			throw new NotFoundException(PROFILE_NOT_FOUND);
		}
		if (profile.id === currentUserId) {
			throw new UnprocessableEntityException({
				errors: { follow: [UNABLE_FOLLOW_SELF] },
			});
		}
		const currentUser = await this.usersRepository.findOne(
			{ id: currentUserId },
			{ relations: ['follow'] },
		);
		if (!currentUser) {
			throw new UnauthorizedException(NOT_AUTHORIZED);
		}
		return { profile, currentUser };
	}

	buildProfileResponse(profile: ProfileType): ProfileResponse {
		delete profile.email;
		delete profile.favorites;
		return {
			profile: { ...profile },
		};
	}
}
