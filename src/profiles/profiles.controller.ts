import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '@/users/decorators/user.decorator';
import { ProfilesService } from './profiles.service';
import { IProfileResponse } from './types/profile-response.interface';
import { AuthGuard } from '@/users/guards/auth.guard';

@Controller('profiles')
export class ProfilesController {
	constructor(private readonly profilesService: ProfilesService) {}

	@Get(':username')
	async getProfile(
		@Param('username') profileUsername: string,
		@CurrentUser('id') currentUserId: string,
	): Promise<IProfileResponse> {
		const profile = await this.profilesService.getProfile(
			profileUsername,
			currentUserId,
		);
		return this.profilesService.buildProfileResponse(profile);
	}

	@UseGuards(AuthGuard)
	@Post(':username/follow')
	async followProfile(
		@Param('username') profileUsername: string,
		@CurrentUser('id') currentUserId: string,
	): Promise<IProfileResponse> {
		const profile = await this.profilesService.followProfile(
			profileUsername,
			currentUserId,
		);
		return this.profilesService.buildProfileResponse(profile);
	}

	@UseGuards(AuthGuard)
	@Delete(':username/follow')
	async unfollowProfile(
		@Param('username') profileUsername: string,
		@CurrentUser('id') currentUserId: string,
	): Promise<IProfileResponse> {
		const profile = await this.profilesService.unfollowProfile(
			profileUsername,
			currentUserId,
		);
		return this.profilesService.buildProfileResponse(profile);
	}
}
