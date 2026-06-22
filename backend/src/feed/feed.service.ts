import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FeedService {
  constructor(private prisma: PrismaService) {}

  async findAllTypes() {
    return this.prisma.feedType.findMany({ orderBy: { name: 'asc' } });
  }

  async createType(data: any) {
    return this.prisma.feedType.create({ data });
  }

  async updateType(id: string, data: any) {
    return this.prisma.feedType.update({ where: { id }, data });
  }

  async findAllLogs(poolId?: string) {
    const where = poolId ? { poolId } : {};
    return this.prisma.feedLog.findMany({
      where,
      include: {
        pool: { select: { name: true } },
        feedType: { select: { name: true, brand: true } },
      },
      orderBy: { feedDate: 'desc' },
      take: 100,
    });
  }

  async createLog(data: any) {
    const log = await this.prisma.feedLog.create({
      data,
      include: { pool: { select: { name: true } }, feedType: { select: { name: true } } },
    });

    await this.prisma.feedType.update({
      where: { id: data.feedTypeId },
      data: { stockKg: { decrement: data.quantityKg } },
    });

    return log;
  }

  async getStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalFeedStock, todayLogs, weekLogs] = await Promise.all([
      this.prisma.feedType.aggregate({ _sum: { stockKg: true }, where: { isActive: true } }),
      this.prisma.feedLog.aggregate({ _sum: { quantityKg: true }, where: { feedDate: { gte: today } } }),
      this.prisma.feedLog.aggregate({
        _sum: { quantityKg: true },
        where: { feedDate: { gte: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000) } },
      }),
    ]);

    return {
      totalFeedStockKg: totalFeedStock._sum.stockKg || 0,
      todayConsumptionKg: todayLogs._sum.quantityKg || 0,
      weekConsumptionKg: weekLogs._sum.quantityKg || 0,
    };
  }
}
