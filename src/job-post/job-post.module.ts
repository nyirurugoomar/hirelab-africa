import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { JobCategoryModule } from 'src/job-category/job-category.module';
import { UserModule } from 'src/user/user.module';
import { JobPost } from './entities/job-post.entity';
import { JobPostController } from './job-post.controller';
import { JobPostService } from './job-post.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobPost]),
    UserModule,
    JobCategoryModule,
    AuthModule,
  ],
  controllers: [JobPostController],
  providers: [JobPostService],
  exports: [JobPostService],
})
export class JobPostModule {}
