import { IsEnum, IsInt, IsNotEmpty, Length, Min } from 'class-validator';
import {
  StatusEnum,
  TypeEnum,
  WorkSpaceEnum,
} from '../entities/job-post.entity';

export class CreateJobPostDto {
  @Length(2, 100)
  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  readonly description: string;

  @Length(2, 100)
  @IsNotEmpty()
  readonly salary_range?: string;

  @Length(2, 100)
  @IsNotEmpty()
  readonly address: string;

  @IsEnum(TypeEnum)
  @IsNotEmpty()
  readonly type: TypeEnum;

  @IsEnum(WorkSpaceEnum)
  @IsNotEmpty()
  readonly workspace: WorkSpaceEnum;

  @IsEnum(StatusEnum)
  @IsNotEmpty()
  readonly status: StatusEnum;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  readonly job_category_id: number;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  readonly posted_by: number;
}
