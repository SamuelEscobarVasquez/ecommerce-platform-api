import {
  IsString,
  IsEmail,
  MinLength,
  IsNumber,
  IsNotEmpty,
  MaxLength,
  IsDefined
} from 'class-validator';

export class LoginUserDto {
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
}