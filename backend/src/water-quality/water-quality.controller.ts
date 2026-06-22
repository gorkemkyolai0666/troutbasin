import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { WaterQualityService } from './water-quality.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('water-quality')
@UseGuards(JwtAuthGuard)
export class WaterQualityController {
  constructor(private waterQualityService: WaterQualityService) {}

  @Get()
  findAll(@Query('poolId') poolId?: string) {
    return this.waterQualityService.findAll(poolId);
  }

  @Post()
  create(@Body() data: any) {
    return this.waterQualityService.create(data);
  }

  @Get('latest')
  getLatestByPool() {
    return this.waterQualityService.getLatestByPool();
  }

  @Get('averages')
  getAverages() {
    return this.waterQualityService.getAverages();
  }
}
