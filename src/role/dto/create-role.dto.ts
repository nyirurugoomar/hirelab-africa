import { IsEnum, IsNotEmpty, Length } from 'class-validator';

export enum StatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export class CreateRoleDto {
  @Length(2, 100)
  @IsNotEmpty()
  readonly name: string;

  @IsEnum(StatusEnum)
  @IsNotEmpty()
  readonly status: StatusEnum;
}
