import {
  IsString,
  IsEmail,
  MinLength,
  IsNumber,
  IsNotEmpty,
  MaxLength,
  IsDefined
} from 'class-validator';

export class CreateUserDto {
  @IsDefined()
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  @IsNotEmpty()
  username!: string;

  @IsDefined()
  @IsEmail()
  @MaxLength(100)
  @IsNotEmpty()
  email!: string;

  @IsDefined()
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password!: string;

  @IsDefined()
  @IsNumber()
  @IsNotEmpty()
  roleId!: number;
}