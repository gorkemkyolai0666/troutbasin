import { Test, TestingModule } from '@nestjs/testing';
import { SaleService } from './sale.service';
import { PrismaService } from '../prisma/prisma.service';

describe('SaleService', () => {
  let service: SaleService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      sale: {
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        aggregate: jest.fn().mockResolvedValue({ _sum: { totalAmount: 50000 } }),
        count: jest.fn().mockResolvedValue(2),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SaleService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<SaleService>(SaleService);
  });

  it('should return all sales', async () => {
    const result = await service.findAll();
    expect(prisma.sale.findMany).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('should return sale stats', async () => {
    const stats = await service.getStats();
    expect(stats.monthlyRevenue).toBe(50000);
    expect(stats.pendingSales).toBe(2);
  });
});
