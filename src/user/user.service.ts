import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { StatusEnum, User } from './entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { RoleService } from 'src/role/role.service';
import { ProfileService } from 'src/profile/profile.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly roleService: RoleService,
    @Inject(forwardRef(() => ProfileService))
    private readonly profileService: ProfileService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      // check if user already exist
      const user = await this.userRepository.findOneBy({
        email: createUserDto.email,
      });

      if (user)
        throw new ConflictException('A user with this email already exists!');

      // Check if role is available
      const role = await this.roleService.getRoleByName(createUserDto.role);

      if (!role) throw new NotFoundException(`Role not found!`);

      const newUser = this.userRepository.create({
        email: createUserDto.email,
        password: createUserDto.password,
        status: createUserDto.status
          ? StatusEnum.ACTIVE
          : createUserDto.role === 'Candidate'
          ? StatusEnum.ACTIVE
          : StatusEnum.INACTIVE,
      });
      newUser.role = role;
      newUser.uuid = uuidv4();
      if (await this.userRepository.save(newUser)) {
        if (await this.profileService.createProfile(createUserDto)) {
          return newUser;
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async getUsers(): Promise<User[]> {
    return await this.userRepository.find({
      order: {
        id: 'DESC',
      },
    });
  }

  async getUserById(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id: id,
        },
        relations: ['profile', 'role', 'cv'],
      });
      if (!user) throw new ConflictException(`User not found`);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          email: email,
        },
        relations: ['profile', 'role', 'cv'],
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUserByRole(role_name: string): Promise<User[]> {
    try {
      const companies = await this.userRepository.find({
        where: {
          role: {
            name: role_name,
          },
        },
        relations: ['profile', 'role', 'cv'],
      });
      return companies;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id: number): Promise<User> {
    const user = await this.getUserById(id);
    return this.userRepository.remove(user);
  }

  async deleteUser(id: number): Promise<User> {
    const user = await this.getUserById(id);
    return this.userRepository.remove(user);
  }
}
