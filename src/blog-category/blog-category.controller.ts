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
import { BlogCategoryService } from './blog-category.service';
import { CreateBlogCategoryDto } from './dto/create-blog-category.dto';
import { UpdateBlogCategoryDto } from './dto/update-blog-category.dto';
import { BlogCategory } from './entities/blog-category.entity';

@Controller('blog-categories')
export class BlogCategoryController {
  constructor(private readonly blogCategoryService: BlogCategoryService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('add')
  createBlogCategory(
    @Body() createBlogCategoryDto: CreateBlogCategoryDto,
  ): Promise<BlogCategory> {
    return this.blogCategoryService.createBlogCategory(createBlogCategoryDto);
  }

  @Get()
  getBlogCategories(): Promise<BlogCategory[]> {
    return this.blogCategoryService.getBlogCategories();
  }

  @Get(':id')
  getBlogCategory(@Param('id') id: number): Promise<BlogCategory> {
    return this.blogCategoryService.getBlogCategoryById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('update/:id')
  updateBlogCategory(
    @Param('id') id: number,
    @Body() updateBlogCategoryDto: UpdateBlogCategoryDto,
  ): Promise<BlogCategory> {
    return this.blogCategoryService.updateBlogCategory(
      +id,
      updateBlogCategoryDto,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete/:id')
  deleteBlogCategory(@Param('id') id: number): Promise<BlogCategory> {
    return this.blogCategoryService.deleteBlogCategory(id);
  }
}
