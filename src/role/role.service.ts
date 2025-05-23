import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import slugify from 'slugify';
import { slugifyConstants } from 'src/constants';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}
  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    try {
      // Check if role already exists
      const exists = await this.roleRepository.findBy({
        name: Like(`%${createRoleDto.name}%`),
      });

      if (exists.length > 0)
        throw new ConflictException(`A role with this name already exists!`);

      const newRole = this.roleRepository.create(createRoleDto);
      newRole.slug = slugify(newRole.name, slugifyConstants);
      newRole.uuid = uuidv4();
      return await this.roleRepository.save(newRole);
    } catch (error) {
      throw error;
    }
  }

  async getRoles(): Promise<Role[]> {
    try {
      return await this.roleRepository.find({ order: { id: 'DESC' } });
    } catch (error) {
      throw error;
    }
  }

  async getRoleById(id: number): Promise<Role> {
    try {
      const role = await this.roleRepository.findOneBy({ id: id });
      if (!role) throw new NotFoundException(`Role not found!`);
      return role;
    } catch (error) {
      throw error;
    }
  }

  async getRoleByName(name: string): Promise<Role> {
    try {
      const role = await this.roleRepository.findOneBy({ name: name });
      if (!role) throw new NotFoundException(`Role not found!`);
      return role;
    } catch (error) {
      throw error;
    }
  }

  async updateRole(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    try {
      const role = await this.getRoleById(id);
      if (!role) throw new NotFoundException(`Role not found!`);
      role.name = updateRoleDto.name;
      role.slug = slugify(role.name, slugifyConstants);
      role.status = updateRoleDto.status;
      return this.roleRepository.save(role);
    } catch (error) {
      throw error;
    }
  }

  async deleteRole(id: number): Promise<Role> {
    try {
      const role = await this.getRoleById(id);
      if (!role) throw new NotFoundException(`Role not found!`);
      return this.roleRepository.remove(role);
    } catch (error) {
      throw error;
    }
  }
}
