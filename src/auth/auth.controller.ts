import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  signIn(@Body() signinDto: SignInDto) {
    return this.authService.signIn(signinDto);
  }

  @Post('/signup')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('status')
  authenticationStatus(): object {
    return {
      status: '200 OK',
      message: 'Authenticated',
    };
  }
}
