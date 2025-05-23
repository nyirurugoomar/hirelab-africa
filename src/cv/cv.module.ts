import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { CvController } from './cv.controller';
import { CvService } from './cv.service';
import { Cv } from './entities/cv.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cv]),
    forwardRef(() => UserModule),
    AuthModule,
  ],
  controllers: [CvController],
  providers: [CvService],
  exports: [CvService],
})
export class CvModule {}
