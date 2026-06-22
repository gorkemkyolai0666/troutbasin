import { Test, TestingModule } from '@nestjs/testing';
import { PoolService } from './pool.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PoolService', () => {
  let service: PoolService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      pool: {
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        aggregate: jest.fn().mockResolvedValue({ _sum: { capacity: 500 } }),
        count: jest.fn().mockResolvedValue(3),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PoolService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<PoolService>(PoolService);
  });

  it('should return all pools', async () => {
    const result = await service.findAll();
    expect(prisma.pool.findMany).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('should create a pool', async () => {
    const data = { name: 'Test', poolType: 'CONCRETE', capacity: 1000, volume: 50 };
    prisma.pool.create.mockResolvedValue({ id: '1', ...data });
    const result = await service.create(data);
    expect(result.name).toBe('Test');
  });

  it('should return pool stats', async () => {
    prisma.pool.findMany.mockResolvedValue([
      { id: '1', stocks: [{ count: 100 }, { count: 200 }] },
    ]);
    const stats = await service.getStats();
    expect(stats.totalPools).toBe(1);
    expect(stats.activePools).toBe(3);
    expect(stats.totalFish).toBe(300);
  });
});
