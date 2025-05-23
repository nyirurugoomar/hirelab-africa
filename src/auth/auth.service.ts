import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { SignInDto } from './dto/signin.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtTokenService: JwtService,
  ) {}

  async signIn(credentials: SignInDto): Promise<object> {
    // retrieve user
    const user = await this.userService.getUserByEmail(credentials.email);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const password = credentials.password;
    const hash = user.password;
    const isMatch = await bcrypt.compare(password, hash);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const token_payload = {
      sub: user.id,
      email: user.email,
      role: user.role.name,
      type: 'user',
    };
    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.profile,
        cv: user.cv,
      },
      access_token: this.jwtTokenService.sign(token_payload),
    };
  }

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    const password = createUserDto.password;
    const saltOrRounds = 16;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return await this.userService.createUser({
      ...createUserDto,
      password: hash,
    });
  }

  async decodeToken(auth: string) {
    const jwt = auth.replace('Bearer ', '');
    return this.jwtTokenService.decode(jwt, { json: true });
  }
}
