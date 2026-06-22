import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WaterQualityService {
  constructor(private prisma: PrismaService) {}

  async findAll(poolId?: string) {
    const where = poolId ? { poolId } : {};
    return this.prisma.waterQuality.findMany({
      where,
      include: { pool: { select: { name: true } } },
      orderBy: { measureDate: 'desc' },
      take: 100,
    });
  }

  async create(data: any) {
    return this.prisma.waterQuality.create({
      data,
      include: { pool: { select: { name: true } } },
    });
  }

  async getLatestByPool() {
    const pools = await this.prisma.pool.findMany({ where: { status: 'ACTIVE' } });
    const results: Array<{ pool: { id: string; name: string }; latestReading: any }> = [];

    for (const pool of pools) {
      const latest = await this.prisma.waterQuality.findFirst({
        where: { poolId: pool.id },
        orderBy: { measureDate: 'desc' },
      });
      results.push({ pool: { id: pool.id, name: pool.name }, latestReading: latest });
    }

    return results;
  }

  async getAverages() {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const result = await this.prisma.waterQuality.aggregate({
      _avg: { temperature: true, dissolvedOxygen: true, ph: true, ammonia: true, nitrite: true },
      where: { measureDate: { gte: sevenDaysAgo } },
    });

    return {
      avgTemperature: result._avg.temperature ? Math.round(result._avg.temperature * 10) / 10 : null,
      avgDissolvedOxygen: result._avg.dissolvedOxygen ? Math.round(result._avg.dissolvedOxygen * 10) / 10 : null,
      avgPh: result._avg.ph ? Math.round(result._avg.ph * 10) / 10 : null,
      avgAmmonia: result._avg.ammonia ? Math.round(result._avg.ammonia * 100) / 100 : null,
      avgNitrite: result._avg.nitrite ? Math.round(result._avg.nitrite * 100) / 100 : null,
    };
  }
}
