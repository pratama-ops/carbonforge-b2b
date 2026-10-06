import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionQueryDto } from './dto/transaction-query.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('EXPORTER')
  async create(@Body() dto: CreateTransactionDto) {
    return this.transactionService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Request() req) {
    const query = new TransactionQueryDto();
    query.userId = req.user.id;
    return this.transactionService.findByUser(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.transactionService.findByUser({ userId: id } as any);
  }
}
