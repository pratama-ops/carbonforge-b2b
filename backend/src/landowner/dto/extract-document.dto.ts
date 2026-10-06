import { IsOptional, IsString, IsUUID } from 'class-validator';

export class ExtractDocumentDto {
  @IsOptional()
  @IsUUID()
  landPlotId?: string;

  @IsOptional()
  @IsString()
  fileType?: string;
}
