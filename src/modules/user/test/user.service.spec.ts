import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../shared/prisma/PrismaService';
import { EntityNotFoundError } from '../../../shared/errors/EntityDoesNotExistsError';
import { UniqueKeyViolationError } from '../../../shared/errors/UniqueKeyViolationError';
import { InvalidPasswordError } from '../../../shared/errors/InvalidPasswordErorr';
import { hash, compare } from 'bcryptjs';
import { UserService } from '../user.service';

jest.mock('bcryptjs');

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      (hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockPrisma.user.create.mockResolvedValue({
        email: 'test@example.com',
        name: 'Test',
        role: 'User',
      });

      const result = await service.create({
        email: 'test@example.com',
        name: 'Test',
        password: '123456',
        role: 'User',
      });

      expect(result).toEqual({
        email: 'test@example.com',
        name: 'Test',
        role: 'User',
      });
    });

    it('should throw UniqueKeyViolationError if user already exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({});

      await expect(
        service.create({
          email: 'test@example.com',
          name: 'Test',
          password: '123456',
          role: 'User',
        }),
      ).rejects.toThrow(UniqueKeyViolationError);
    });
  });

  describe('userProfile', () => {
    it('should return user profile', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        email: 'test@example.com',
        name: 'Test',
        role: 'User',
      });

      const result = await service.userProfile('user-id');
      expect(result).toEqual({
        email: 'test@example.com',
        name: 'Test',
        role: 'User',
      });
    });

    it('should throw EntityNotFoundError if user does not exist', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      await expect(service.userProfile('user-id')).rejects.toThrow(EntityNotFoundError);
    });
  });

  describe('update', () => {
    it('should update user information', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'user-id' });
      (hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockPrisma.user.update.mockResolvedValue({
        email: 'updated@example.com',
        name: 'Updated',
        role: 'User',
      });

      const result = await service.update('user-id', {
        email: 'updated@example.com',
        name: 'Updated',
        password: 'newpass',
        role: 'User',
      });

      expect(result).toEqual({
        email: 'updated@example.com',
        name: 'Updated',
        role: 'User',
      });
    });

    it('should throw EntityNotFoundError if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      await expect(service.update('user-id', {})).rejects.toThrow(EntityNotFoundError);
    });
  });

  describe('delete', () => {
    it('should delete user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'user-id' });
      mockPrisma.user.delete.mockResolvedValue(undefined);

      await expect(service.delete('user-id')).resolves.toBeUndefined();
      expect(mockPrisma.user.delete).toHaveBeenCalledWith({
        where: { id: 'user-id' },
      });
    });

    it('should throw EntityNotFoundError if user does not exist', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      await expect(service.delete('user-id')).rejects.toThrow(EntityNotFoundError);
    });
  });

  describe('login', () => {
    it('should return userId if credentials match', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-id',
        email: 'test@example.com',
        password: 'hashedPassword',
      });
      (compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login('test@example.com', 'password');
      expect(result).toEqual({ userId: 'user-id' });
    });

    it('should throw EntityNotFoundError if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      await expect(service.login('notfound@example.com', 'password')).rejects.toThrow(EntityNotFoundError);
    });

    it('should throw InvalidPasswordError if password does not match', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-id',
        email: 'test@example.com',
        password: 'hashedPassword',
      });
      (compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login('test@example.com', 'wrongpass')).rejects.toThrow(InvalidPasswordError);
    });
  });
});
