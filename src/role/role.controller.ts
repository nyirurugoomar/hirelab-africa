import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  //@UseGuards(AuthGuard('jwt'))
  @Post('add')
  createRole(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return this.roleService.createRole(createRoleDto);
  }

  //@UseGuards(AuthGuard('jwt'))
  @Get()
  getRoles(): Promise<Role[]> {
    return this.roleService.getRoles();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  getRole(@Param('id') id: number): Promise<Role> {
    return this.roleService.getRoleById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('update/:id')
  updateRole(
    @Param('id') id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<Role> {
    return this.roleService.updateRole(+id, updateRoleDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete/:id')
  deleteRole(@Param('id') id: number): Promise<Role> {
    return this.roleService.deleteRole(id);
  }
}
