import { IsEmail } from 'class-validator';
export class CreateUserDto {
  readonly first_name: string;
  readonly last_name: string;
  @IsEmail()
  readonly email: string;
  readonly company_name: string;
  readonly company_description: string;
  readonly password: string;
  readonly role: string;
  readonly status?: string;
}
