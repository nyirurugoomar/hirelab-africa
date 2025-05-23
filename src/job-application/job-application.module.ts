import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CvModule } from 'src/cv/cv.module';
import { JobPostModule } from 'src/job-post/job-post.module';
import { UserModule } from 'src/user/user.module';
import { JobApplication } from './entities/job-application.entity';
import { JobApplicationController } from './job-application.controller';
import { JobApplicationService } from './job-application.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobApplication]),
    UserModule,
    JobPostModule,
    CvModule,
    AuthModule,
  ],
  controllers: [JobApplicationController],
  providers: [JobApplicationService],
  exports: [JobApplicationService],
})
export class JobApplicationModule {}
