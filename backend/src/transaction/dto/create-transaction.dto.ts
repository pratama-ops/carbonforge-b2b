import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class CreateTransactionDto {
  @IsString({ message: 'Land plot ID must be a string' })
  @IsNotEmpty({ message: 'Land plot ID is required' })
  landPlotId: string;

  @IsNumber({}, { message: 'Amount must be a number' })
  @IsNotEmpty({ message: 'Amount is required' })
  @Min(0, { message: 'Amount must be at least 0' })
  amount: number;

  @IsNumber({}, { message: 'Total price must be a number' })
  @IsNotEmpty({ message: 'Total price is required' })
  @Min(0, { message: 'Total price must be at least 0' })
  totalPrice: number;
}
