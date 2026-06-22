import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { HealthRecordService } from './health-record.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('health-records')
@UseGuards(JwtAuthGuard)
export class HealthRecordController {
  constructor(private healthRecordService: HealthRecordService) {}

  @Get()
  findAll(@Query('stockId') stockId?: string, @Query('type') type?: string) {
    return this.healthRecordService.findAll(stockId, type);
  }

  @Post()
  create(@Body() data: any) {
    return this.healthRecordService.create(data);
  }

  @Get('stats')
  getStats() {
    return this.healthRecordService.getStats();
  }
}
