import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class DocumentExtractorDto {
  @IsString({ message: 'Document content must be a string' })
  @IsNotEmpty({ message: 'Document content is required' })
  @MaxLength(50000, { message: 'Document content must not exceed 50000 characters' })
  content: string;
}
