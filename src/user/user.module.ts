import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CvModule } from 'src/cv/cv.module';
import { ProfileModule } from 'src/profile/profile.module';
import { RoleModule } from 'src/role/role.module';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    RoleModule,
    forwardRef(() => ProfileModule),
    forwardRef(() => CvModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, RoleModule, ProfileModule],
})
export class UserModule {}
