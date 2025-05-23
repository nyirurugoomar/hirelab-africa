import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { BlogCategoryService } from 'src/blog-category/blog-category.service';
import { slugifyConstants } from 'src/constants';
import { UserService } from 'src/user/user.service';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { BlogPost } from './entities/blog-post.entity';

@Injectable()
export class BlogPostService {
  constructor(
    @InjectRepository(BlogPost)
    private readonly blogPostRepository: Repository<BlogPost>,
    private readonly blogCategoryService: BlogCategoryService,
    private readonly userService: UserService,
  ) {}
  async createBlogPost(
    createBlogPostDto: CreateBlogPostDto,
  ): Promise<BlogPost> {
    try {
      const blogCategory = await this.blogCategoryService.getBlogCategoryById(
        createBlogPostDto.blog_category_id,
      );
      if (!blogCategory) throw new ConflictException(`BlogCategory not found!`);

      const author = await this.userService.getUserById(
        createBlogPostDto.author,
      );
      if (!author) throw new ConflictException(`User not found`);
      const newBlogPost = this.blogPostRepository.create(createBlogPostDto);
      newBlogPost.slug = slugify(newBlogPost.title, slugifyConstants);
      newBlogPost.uuid = uuidv4();
      newBlogPost.blog_category = blogCategory;
      newBlogPost.user = author;
      return await this.blogPostRepository.save(newBlogPost);
    } catch (error) {
      throw error;
    }
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    try {
      return await this.blogPostRepository.find({
        order: { id: 'DESC' },
        relations: ['user', 'user.profile', 'blog_category'],
      });
    } catch (error) {
      throw error;
    }
  }

  async getBlogPostById(id: number): Promise<BlogPost> {
    try {
      const blogPost = await this.blogPostRepository.findOneBy({
        id: id,
      });
      if (!blogPost) throw new NotFoundException(`BlogPost not found!`);
      return blogPost;
    } catch (error) {
      throw error;
    }
  }

  async updateBlogPost(
    id: number,
    updateBlogPostDto: UpdateBlogPostDto,
  ): Promise<BlogPost> {
    try {
      const blogPost = await this.getBlogPostById(id);
      if (!blogPost) throw new NotFoundException(`BlogPost not found!`);
      const blogCategory = await this.blogCategoryService.getBlogCategoryById(
        updateBlogPostDto.blog_category_id,
      );
      if (!blogCategory) throw new ConflictException(`BlogCategory not found!`);

      const author = await this.userService.getUserById(
        updateBlogPostDto.author,
      );
      if (!author) throw new ConflictException(`User not found`);
      blogPost.title = updateBlogPostDto.title;
      blogPost.slug = slugify(updateBlogPostDto.title, slugifyConstants);
      blogPost.description = updateBlogPostDto.description;
      blogPost.image = updateBlogPostDto.image;
      blogPost.status = updateBlogPostDto.status;
      blogPost.blog_category = blogCategory;
      blogPost.user = author;
      return this.blogPostRepository.save(blogPost);
    } catch (error) {
      throw error;
    }
  }

  async deleteBlogPost(id: number): Promise<BlogPost> {
    try {
      const blogPost = await this.getBlogPostById(id);
      if (!blogPost) throw new NotFoundException(`BlogPost not found!`);
      return this.blogPostRepository.remove(blogPost);
    } catch (error) {
      throw error;
    }
  }
}
