import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsNumber,
  Min
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name!: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  description?: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  sku!: string;

  @IsNumber()
  @Min(0)
  inventory!: number;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  imageUrl?: string;
}
