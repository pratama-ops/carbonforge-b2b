import { IsNotEmpty, IsNumber, Min, IsOptional, IsString } from 'class-validator';

export class MatchmakingRequestDto {
  @IsNumber({}, { message: 'Required carbon amount must be a number' })
  @IsNotEmpty({ message: 'Required carbon amount is required' })
  @Min(1, { message: 'Required carbon amount must be at least 1' })
  requiredCarbonAmount: number;

  @IsString({ message: 'Preferred location must be a string' })
  @IsOptional()
  preferredLocation?: string;
}
