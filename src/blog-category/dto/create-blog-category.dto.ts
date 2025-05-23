import { IsNotEmpty, Length } from 'class-validator';
import { StatusOptions } from '../entities/blog-category.entity';

export class CreateBlogCategoryDto {
  @Length(2, 100)
  @IsNotEmpty()
  readonly name: string;

  @Length(2, 100)
  @IsNotEmpty()
  readonly status: StatusOptions;
}
