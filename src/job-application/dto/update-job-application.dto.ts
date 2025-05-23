import { IsEnum, IsNotEmpty } from 'class-validator';
import { StatusEnum } from './create-job-application.dto';

export class UpdateJobApplicationDto {
  @IsEnum(StatusEnum)
  @IsNotEmpty()
  readonly status: StatusEnum;
}
