import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PoolService } from './pool.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('pools')
@UseGuards(JwtAuthGuard)
export class PoolController {
  constructor(private poolService: PoolService) {}

  @Get()
  findAll(@Query('status') status?: string) {
    return this.poolService.findAll(status);
  }

  @Get('stats')
  getStats() {
    return this.poolService.getStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.poolService.findOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.poolService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.poolService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.poolService.remove(id);
  }
}
