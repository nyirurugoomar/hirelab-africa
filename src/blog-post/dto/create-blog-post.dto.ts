import { IsEnum, IsInt, IsNotEmpty, Length, Min } from 'class-validator';
import { StatusEnum } from '../entities/blog-post.entity';

export class CreateBlogPostDto {
  @Length(2, 100)
  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  readonly description: string;

  @IsNotEmpty()
  readonly image: string;

  @IsEnum(StatusEnum)
  @IsNotEmpty()
  readonly status: StatusEnum;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  readonly blog_category_id: number;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  readonly author: number;
}
