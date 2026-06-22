import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  async findAll(poolId?: string) {
    const where = poolId ? { poolId } : {};
    return this.prisma.fishStock.findMany({
      where,
      include: { pool: { select: { name: true } }, _count: { select: { healthRecords: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const stock = await this.prisma.fishStock.findUnique({
      where: { id },
      include: { pool: true, healthRecords: { orderBy: { recordDate: 'desc' } } },
    });
    if (!stock) throw new NotFoundException('Stok bulunamadı');
    return stock;
  }

  async create(data: any) {
    return this.prisma.fishStock.create({ data, include: { pool: { select: { name: true } } } });
  }

  async update(id: string, data: any) {
    return this.prisma.fishStock.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.fishStock.delete({ where: { id } });
  }

  async getSummary() {
    const stocks = await this.prisma.fishStock.findMany({ include: { pool: { select: { name: true } } } });
    const totalFish = stocks.reduce((sum, s) => sum + s.count, 0);
    const totalBiomass = stocks.reduce((sum, s) => sum + (s.count * s.avgWeight) / 1000, 0);
    const speciesMap = new Map<string, number>();
    stocks.forEach(s => speciesMap.set(s.species, (speciesMap.get(s.species) || 0) + s.count));

    return {
      totalFish,
      totalBiomassKg: Math.round(totalBiomass * 100) / 100,
      stockCount: stocks.length,
      speciesDistribution: Object.fromEntries(speciesMap),
    };
  }
}
