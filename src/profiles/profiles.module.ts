import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/users/entities/user.entity';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	controllers: [ProfilesController],
	providers: [ProfilesService],
})
export class ProfilesModule {}
