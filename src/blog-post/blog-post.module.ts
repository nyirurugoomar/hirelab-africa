import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { BlogCategoryModule } from 'src/blog-category/blog-category.module';
import { BlogCategory } from 'src/blog-category/entities/blog-category.entity';
import { UserModule } from 'src/user/user.module';
import { BlogPostController } from './blog-post.controller';
import { BlogPostService } from './blog-post.service';
import { BlogPost } from './entities/blog-post.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlogPost, BlogCategory]),
    UserModule,
    BlogCategoryModule,
    AuthModule,
  ],
  controllers: [BlogPostController],
  providers: [BlogPostService],
  exports: [BlogPostService],
})
export class BlogPostModule {}
