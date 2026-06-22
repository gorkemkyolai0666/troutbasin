import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HealthRecordService {
  constructor(private prisma: PrismaService) {}

  async findAll(stockId?: string, type?: string) {
    const where: any = {};
    if (stockId) where.stockId = stockId;
    if (type) where.recordType = type;
    return this.prisma.healthRecord.findMany({
      where,
      include: { stock: { include: { pool: { select: { name: true } } } } },
      orderBy: { recordDate: 'desc' },
      take: 100,
    });
  }

  async create(data: any) {
    return this.prisma.healthRecord.create({
      data,
      include: { stock: { include: { pool: { select: { name: true } } } } },
    });
  }

  async getStats() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [totalMortality, diseaseCount, recentRecords] = await Promise.all([
      this.prisma.healthRecord.aggregate({
        _sum: { mortality: true },
        where: { recordDate: { gte: thirtyDaysAgo } },
      }),
      this.prisma.healthRecord.count({
        where: { recordType: 'DISEASE', recordDate: { gte: thirtyDaysAgo } },
      }),
      this.prisma.healthRecord.count({
        where: { recordDate: { gte: thirtyDaysAgo } },
      }),
    ]);

    return {
      monthlyMortality: totalMortality._sum.mortality || 0,
      monthlyDiseaseCount: diseaseCount,
      monthlyRecordCount: recentRecords,
    };
  }
}
