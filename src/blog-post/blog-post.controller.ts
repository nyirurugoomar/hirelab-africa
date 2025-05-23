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
import { BlogPostService } from './blog-post.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { BlogPost } from './entities/blog-post.entity';

@Controller('blog-posts')
export class BlogPostController {
  constructor(private readonly blogPostService: BlogPostService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('add')
  createBlogPost(
    @Body() createBlogPostDto: CreateBlogPostDto,
  ): Promise<BlogPost> {
    return this.blogPostService.createBlogPost(createBlogPostDto);
  }

  @Get()
  getBlogPosts(): Promise<BlogPost[]> {
    return this.blogPostService.getBlogPosts();
  }

  @Get(':id')
  getBlogPost(@Param('id') id: number): Promise<BlogPost> {
    return this.blogPostService.getBlogPostById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('update/:id')
  updateBlogPost(
    @Param('id') id: number,
    @Body() updateBlogPostDto: UpdateBlogPostDto,
  ): Promise<BlogPost> {
    return this.blogPostService.updateBlogPost(+id, updateBlogPostDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete/:id')
  deleteBlogPost(@Param('id') id: number): Promise<BlogPost> {
    return this.blogPostService.deleteBlogPost(id);
  }
}
