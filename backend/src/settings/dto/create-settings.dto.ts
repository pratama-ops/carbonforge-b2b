import { IsString, IsJSON, IsOptional, MinLength } from 'class-validator';

export class CreateSettingsDto {
  @IsString()
  @MinLength(2)
  key: string;

  @IsJSON()
  value: Record<string, any>;

  @IsOptional()
  @IsString()
  description?: string;
}
