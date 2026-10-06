import { IsString, MinLength } from 'class-validator';

export class RetireCertificateDto {
  @IsString()
  @MinLength(3)
  retirementReason: string;
}
