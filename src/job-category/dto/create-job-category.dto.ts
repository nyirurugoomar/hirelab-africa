import { IsNotEmpty, Length } from 'class-validator';
import { StatusOptions } from '../entities/job-category.entity';

export class CreateJobCategoryDto {
  @Length(2, 100)
  @IsNotEmpty()
  readonly name: string;

  @Length(2, 100)
  @IsNotEmpty()
  readonly status: StatusOptions;
}
