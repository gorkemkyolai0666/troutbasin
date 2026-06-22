import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { SaleService } from './sale.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('sales')
@UseGuards(JwtAuthGuard)
export class SaleController {
  constructor(private saleService: SaleService) {}

  @Get()
  findAll(@Query('status') status?: string) {
    return this.saleService.findAll(status);
  }

  @Get('stats')
  getStats() {
    return this.saleService.getStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.saleService.findOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.saleService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.saleService.update(id, data);
  }
}
