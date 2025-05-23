import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  Length,
  Min,
} from 'class-validator';

export enum StatusEnum {
  ACCEPT = 'Accept',
  REJECT = 'Reject',
  PENDING = 'Pending',
}

export class CreateJobApplicationDto {
  @Length(2, 100)
  @IsNotEmpty()
  readonly first_name: string;

  @Length(2, 100)
  @IsNotEmpty()
  readonly last_name: string;

  @IsEmail()
  @Length(2, 100)
  @IsNotEmpty()
  readonly email: string;

  @Length(3, 16)
  @IsNotEmpty()
  readonly phone: string;

  @Length(2, 100)
  @IsNotEmpty()
  readonly address: string;

  @Length(2, 100)
  @IsNotEmpty()
  readonly city: string;

  @Length(2, 100)
  @IsNotEmpty()
  readonly country: string;

  @Length(2, 100)
  @IsNotEmpty()
  readonly postcode: string;

  @Length(2, 100)
  @IsNotEmpty()
  readonly file: string;

  readonly cv_id?: number;

  @IsNotEmpty()
  readonly cover_letter: string;

  @IsEnum(StatusEnum)
  @IsNotEmpty()
  readonly status: StatusEnum;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  readonly candidate: number;

  @Length(2, 100)
  @IsNotEmpty()
  readonly job_post_uuid: string;
}
