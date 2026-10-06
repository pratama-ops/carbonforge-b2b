import {
  IsEmail,
  IsEnum,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { UserRole } from '../../generated/prisma/client';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  walletAddress?: string;
}
