import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(AuthGuard('jwt'))
  @Get()
  getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  getUser(@Param('id') id: number): Promise<User> {
    return this.userService.getUserById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('search-email:email')
  getUserByEmail(@Param('email') email: string): Promise<User> {
    return this.userService.getUserByEmail(email);
  }

  @Get('search-role/:role_name')
  getUserByRole(@Param('role_name') role_name: string): Promise<User[]> {
    return this.userService.getUserByRole(role_name);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete/:id')
  deleteRole(@Param('id') id: number): Promise<User> {
    return this.userService.deleteUser(id);
  }
}
