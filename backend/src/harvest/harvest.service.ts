import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HarvestService {
  constructor(private prisma: PrismaService) {}

  async findAll(status?: string) {
    const where = status ? { status: status as any } : {};
    return this.prisma.harvest.findMany({
      where,
      include: { pool: { select: { name: true } } },
      orderBy: { harvestDate: 'desc' },
    });
  }

  async findOne(id: string) {
    const harvest = await this.prisma.harvest.findUnique({
      where: { id },
      include: { pool: true },
    });
    if (!harvest) throw new NotFoundException('Hasat kaydı bulunamadı');
    return harvest;
  }

  async create(data: any) {
    return this.prisma.harvest.create({
      data,
      include: { pool: { select: { name: true } } },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.harvest.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.harvest.delete({ where: { id } });
  }

  async getStats() {
    const thisYear = new Date(new Date().getFullYear(), 0, 1);

    const [totalHarvest, completedCount, planned] = await Promise.all([
      this.prisma.harvest.aggregate({
        _sum: { totalWeightKg: true, totalFish: true },
        where: { status: 'COMPLETED', harvestDate: { gte: thisYear } },
      }),
      this.prisma.harvest.count({ where: { status: 'COMPLETED', harvestDate: { gte: thisYear } } }),
      this.prisma.harvest.count({ where: { status: 'PLANNED' } }),
    ]);

    return {
      yearlyHarvestKg: totalHarvest._sum.totalWeightKg || 0,
      yearlyHarvestFish: totalHarvest._sum.totalFish || 0,
      completedHarvests: completedCount,
      plannedHarvests: planned,
    };
  }
}
