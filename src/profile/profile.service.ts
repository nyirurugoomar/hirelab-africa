import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async createProfile(createUserDto: CreateUserDto): Promise<Profile> {
    try {
      const user = await this.userService.getUserByEmail(createUserDto.email);
      if (!user) throw new ConflictException('User not found!');
      const newProfile = this.profileRepository.create(createUserDto);
      newProfile.user = user;
      return await this.profileRepository.save(newProfile);
    } catch (error) {
      throw error;
    }
  }

  async getProfiles(): Promise<Profile[]> {
    try {
      return await this.profileRepository.find({ order: { id: 'DESC' } });
    } catch (error) {
      throw error;
    }
  }

  async getProfileById(id: number): Promise<Profile> {
    try {
      const profile = await this.profileRepository.findOneBy({ id: id });
      return profile;
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(
    id: number,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    try {
      const profile = await this.getProfileById(id);
      if (!profile) throw new ConflictException(`Profile not found!`);
      profile.first_name = updateProfileDto.first_name;
      profile.last_name = updateProfileDto.last_name;
      profile.company_name = updateProfileDto.company_name;
      profile.company_description = updateProfileDto.company_description;
      profile.email = updateProfileDto.email;
      profile.phone = updateProfileDto.phone;
      profile.address = updateProfileDto.address;
      profile.city = updateProfileDto.city;
      profile.country = updateProfileDto.country;
      profile.postcode = updateProfileDto.postcode;
      profile.avatar = updateProfileDto.avatar;

      return await this.profileRepository.save(profile);
    } catch (error) {
      throw error;
    }
  }
}
