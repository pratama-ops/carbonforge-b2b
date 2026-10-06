import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole, UserStatus } from '../../generated/prisma/client';

export class UpdateUserStatusDto {
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
