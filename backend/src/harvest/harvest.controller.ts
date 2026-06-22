import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { HarvestService } from './harvest.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('harvests')
@UseGuards(JwtAuthGuard)
export class HarvestController {
  constructor(private harvestService: HarvestService) {}

  @Get()
  findAll(@Query('status') status?: string) {
    return this.harvestService.findAll(status);
  }

  @Get('stats')
  getStats() {
    return this.harvestService.getStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.harvestService.findOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.harvestService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.harvestService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.harvestService.remove(id);
  }
}
