import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { slugifyConstants } from 'src/constants';
import { v4 as uuidv4 } from 'uuid';
import { Like, Repository } from 'typeorm';
import { CreateBlogCategoryDto } from './dto/create-blog-category.dto';
import { UpdateBlogCategoryDto } from './dto/update-blog-category.dto';
import { BlogCategory } from './entities/blog-category.entity';

@Injectable()
export class BlogCategoryService {
  constructor(
    @InjectRepository(BlogCategory)
    private readonly blogCategoryRepository: Repository<BlogCategory>,
  ) {}
  async createBlogCategory(
    createBlogCategoryDto: CreateBlogCategoryDto,
  ): Promise<BlogCategory> {
    try {
      const exists = await this.blogCategoryRepository.findBy({
        name: Like(`%${createBlogCategoryDto.name}%`),
      });

      if (exists.length > 0)
        throw new ConflictException(`This category already exists!`);

      const newBlogCategory = this.blogCategoryRepository.create(
        createBlogCategoryDto,
      );
      newBlogCategory.slug = slugify(newBlogCategory.name, slugifyConstants);
      newBlogCategory.uuid = uuidv4();
      return await this.blogCategoryRepository.save(newBlogCategory);
    } catch (error) {
      throw error;
    }
  }

  async getBlogCategories(): Promise<BlogCategory[]> {
    try {
      return await this.blogCategoryRepository.find({ order: { id: 'DESC' } });
    } catch (error) {
      throw error;
    }
  }

  async getBlogCategoryById(id: number): Promise<BlogCategory> {
    try {
      const blogCategory = await this.blogCategoryRepository.findOneBy({
        id: id,
      });
      if (!blogCategory) throw new NotFoundException(`BlogCategory not found!`);
      return blogCategory;
    } catch (error) {
      throw error;
    }
  }

  async updateBlogCategory(
    id: number,
    updateBlogCategoryDto: UpdateBlogCategoryDto,
  ): Promise<BlogCategory> {
    try {
      const blogCategory = await this.getBlogCategoryById(id);
      if (!blogCategory) throw new NotFoundException(`BlogCategory not found!`);
      blogCategory.name = updateBlogCategoryDto.name;
      blogCategory.slug = slugify(blogCategory.name, slugifyConstants);
      blogCategory.status = updateBlogCategoryDto.status;
      return this.blogCategoryRepository.save(blogCategory);
    } catch (error) {
      throw error;
    }
  }

  async deleteBlogCategory(id: number): Promise<BlogCategory> {
    try {
      const blogCategory = await this.getBlogCategoryById(id);
      if (!blogCategory) throw new NotFoundException(`BlogCategory not found!`);
      return this.blogCategoryRepository.remove(blogCategory);
    } catch (error) {
      throw error;
    }
  }
}
