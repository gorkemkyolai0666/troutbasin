import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: any;
  let jwt: any;

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };

    jwt = {
      sign: jest.fn().mockReturnValue('test-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwt },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should create new user and return token', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        id: '1', email: 'test@test.com', name: 'Test', role: 'OPERATOR',
      });

      const result = await service.register({ email: 'test@test.com', password: '123456', name: 'Test' });
      expect(result.access_token).toBe('test-token');
      expect(result.user.email).toBe('test@test.com');
    });

    it('should throw ConflictException for existing email', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: '1', email: 'test@test.com' });
      await expect(service.register({ email: 'test@test.com', password: '123456', name: 'Test' }))
        .rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException for invalid email', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.login({ email: 'wrong@test.com', password: '123456' }))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const hash = await bcrypt.hash('correct', 10);
      prisma.user.findUnique.mockResolvedValue({ id: '1', email: 'test@test.com', password: hash, role: 'ADMIN' });
      await expect(service.login({ email: 'test@test.com', password: 'wrong' }))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should return token for valid credentials', async () => {
      const hash = await bcrypt.hash('123456', 10);
      prisma.user.findUnique.mockResolvedValue({
        id: '1', email: 'test@test.com', name: 'Test', password: hash, role: 'ADMIN',
      });

      const result = await service.login({ email: 'test@test.com', password: '123456' });
      expect(result.access_token).toBe('test-token');
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: '1', email: 'test@test.com', name: 'Test', role: 'ADMIN',
      });

      const result = await service.getProfile('1');
      expect(result.email).toBe('test@test.com');
    });

    it('should throw UnauthorizedException for missing user', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.getProfile('nonexistent')).rejects.toThrow(UnauthorizedException);
    });
  });
});
