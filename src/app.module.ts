import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleModule } from './role/role.module';
import { CvModule } from './cv/cv.module';
import { JobPostModule } from './job-post/job-post.module';
import { JobCategoryModule } from './job-category/job-category.module';
import { BlogPostModule } from './blog-post/blog-post.module';
import { BlogCategoryModule } from './blog-category/blog-category.module';
import config from '../ormconfig';
import { JobApplicationModule } from './job-application/job-application.module';
import { UserModule } from './user/user.module';
import { ProfileModule } from './profile/profile.module';
import { AuthModule } from './auth/auth.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // no need to import into other modules
    }),
    TypeOrmModule.forRoot(config),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    RoleModule,
    JobApplicationModule,
    CvModule,
    JobPostModule,
    JobCategoryModule,
    BlogPostModule,
    BlogCategoryModule,
    UserModule,
    ProfileModule,
    AuthModule,
    FileUploadModule,
    MailModule,
  ],
})
export class AppModule {}
