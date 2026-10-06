import { IsString, MinLength } from 'class-validator';

export class SettingsKeyDto {
  @IsString()
  @MinLength(2)
  key: string;
}
