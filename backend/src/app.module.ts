import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { PoolModule } from './pool/pool.module';
import { StockModule } from './stock/stock.module';
import { FeedModule } from './feed/feed.module';
import { HealthRecordModule } from './health-record/health-record.module';
import { WaterQualityModule } from './water-quality/water-quality.module';
import { HarvestModule } from './harvest/harvest.module';
import { CustomerModule } from './customer/customer.module';
import { SaleModule } from './sale/sale.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    HealthModule,
    PoolModule,
    StockModule,
    FeedModule,
    HealthRecordModule,
    WaterQualityModule,
    HarvestModule,
    CustomerModule,
    SaleModule,
  ],
})
export class AppModule {}
