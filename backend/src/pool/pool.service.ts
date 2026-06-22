import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PoolService {
  constructor(private prisma: PrismaService) {}

  async findAll(status?: string) {
    const where = status ? { status: status as any } : {};
    return this.prisma.pool.findMany({
      where,
      include: { _count: { select: { stocks: true, feedLogs: true, harvests: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const pool = await this.prisma.pool.findUnique({
      where: { id },
      include: {
        stocks: { orderBy: { createdAt: 'desc' } },
        waterQuality: { orderBy: { measureDate: 'desc' }, take: 5 },
        harvests: { orderBy: { harvestDate: 'desc' }, take: 5 },
      },
    });
    if (!pool) throw new NotFoundException('Havuz bulunamadı');
    return pool;
  }

  async create(data: any) {
    return this.prisma.pool.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.pool.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.pool.delete({ where: { id } });
  }

  async getStats() {
    const [pools, totalCapacity, activeCount] = await Promise.all([
      this.prisma.pool.findMany({ include: { stocks: true } }),
      this.prisma.pool.aggregate({ _sum: { capacity: true } }),
      this.prisma.pool.count({ where: { status: 'ACTIVE' } }),
    ]);

    const totalFish = pools.reduce((sum, p) => sum + p.stocks.reduce((s, st) => s + st.count, 0), 0);

    return {
      totalPools: pools.length,
      activePools: activeCount,
      totalCapacity: totalCapacity._sum.capacity || 0,
      totalFish,
    };
  }
}
