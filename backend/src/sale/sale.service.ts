import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SaleService {
  constructor(private prisma: PrismaService) {}

  async findAll(status?: string) {
    const where = status ? { status: status as any } : {};
    return this.prisma.sale.findMany({
      where,
      include: {
        customer: { select: { name: true, city: true } },
        items: true,
      },
      orderBy: { saleDate: 'desc' },
    });
  }

  async findOne(id: string) {
    const sale = await this.prisma.sale.findUnique({
      where: { id },
      include: { customer: true, items: true },
    });
    if (!sale) throw new NotFoundException('Satış bulunamadı');
    return sale;
  }

  async create(data: any) {
    const { items, ...saleData } = data;
    return this.prisma.sale.create({
      data: {
        ...saleData,
        items: { create: items || [] },
      },
      include: { customer: { select: { name: true } }, items: true },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.sale.update({ where: { id }, data });
  }

  async getStats() {
    const thisMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const thisYear = new Date(new Date().getFullYear(), 0, 1);

    const [monthlyRevenue, yearlyRevenue, pendingCount, deliveredCount] = await Promise.all([
      this.prisma.sale.aggregate({
        _sum: { totalAmount: true },
        where: { saleDate: { gte: thisMonth }, status: { not: 'CANCELLED' } },
      }),
      this.prisma.sale.aggregate({
        _sum: { totalAmount: true },
        where: { saleDate: { gte: thisYear }, status: { not: 'CANCELLED' } },
      }),
      this.prisma.sale.count({ where: { status: 'PENDING' } }),
      this.prisma.sale.count({ where: { status: 'DELIVERED', saleDate: { gte: thisMonth } } }),
    ]);

    return {
      monthlyRevenue: monthlyRevenue._sum.totalAmount || 0,
      yearlyRevenue: yearlyRevenue._sum.totalAmount || 0,
      pendingSales: pendingCount,
      deliveredThisMonth: deliveredCount,
    };
  }
}
