import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';
import { ProfileService } from './profile.service';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getProfiles(): Promise<Profile[]> {
    return this.profileService.getProfiles();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  getProfile(@Param('id') id: number): Promise<Profile> {
    return this.profileService.getProfileById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('update/:id')
  updateProfile(
    @Param('id') id: number,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    return this.profileService.updateProfile(+id, updateProfileDto);
  }
}
