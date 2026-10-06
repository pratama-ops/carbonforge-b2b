import { IsOptional, IsUUID, IsString, IsIn } from 'class-validator';

export class UploadDocumentDto {
  @IsOptional()
  @IsUUID()
  landPlotId?: string;

  @IsOptional()
  @IsString()
  @IsIn(['PDF', 'IMAGE'])
  fileType?: string;
}
