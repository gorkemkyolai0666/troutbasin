import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { FeedService } from './feed.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('feed')
@UseGuards(JwtAuthGuard)
export class FeedController {
  constructor(private feedService: FeedService) {}

  @Get('types')
  findAllTypes() {
    return this.feedService.findAllTypes();
  }

  @Post('types')
  createType(@Body() data: any) {
    return this.feedService.createType(data);
  }

  @Put('types/:id')
  updateType(@Param('id') id: string, @Body() data: any) {
    return this.feedService.updateType(id, data);
  }

  @Get('logs')
  findAllLogs(@Query('poolId') poolId?: string) {
    return this.feedService.findAllLogs(poolId);
  }

  @Post('logs')
  createLog(@Body() data: any) {
    return this.feedService.createLog(data);
  }

  @Get('stats')
  getStats() {
    return this.feedService.getStats();
  }
}
