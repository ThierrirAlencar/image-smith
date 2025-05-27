import { Test, TestingModule } from '@nestjs/testing';
import { EntityNotFoundError } from '../../../shared/errors/EntityDoesNotExistsError';
import { ImageService } from '../image.service';
import { PrismaService } from '../../../shared/prisma/PrismaService';

describe('ImageService', () => {
  let service: ImageService;
  let prisma: PrismaService;

  const mockPrisma = {
    image: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    },
    image_processing: {
      findMany: jest.fn(),
      deleteMany: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImageService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ImageService>(ImageService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should create an image', async () => {
      const input = {
        original_filename: 'test.png',
        stored_filepath: '/path/test.png',
        user_id: 'user-123',
        user_favorite:false
      };
      const result = { Id: 'img-1', ...input, created_at: new Date(), updated_at: new Date(), process_filepath: '', size: 123 };

      mockPrisma.image.create.mockResolvedValue(result);

      const created = await service.create(input);
      expect(created).toEqual(result);
      expect(mockPrisma.image.create).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  describe('findOne', () => {
    it('should return image if exists', async () => {
      const image = { Id: 'img-1' };
      mockPrisma.image.findUnique.mockResolvedValue(image);

      const result = await service.findOne('img-1');
      expect(result).toEqual(image);
    });

    it('should throw error if image not found', async () => {
      mockPrisma.image.findUnique.mockResolvedValue(null);
      await expect(service.findOne('non-existent')).rejects.toThrow(EntityNotFoundError);
    });
  });

  describe('findManyByUserId', () => {
    it('should return images grouped by user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ email: 'a@a.com', name: 'Alice' });
      mockPrisma.image.findMany.mockResolvedValue([
        { Id: 'img-1', user_favorite: true, created_at: new Date(), stored_filepath: 'path/to/img' },
      ]);
      mockPrisma.image_processing.findMany.mockResolvedValue([
        { id: 'proc-1', created_at: new Date(), output_filename: 'out.png' },
      ]);

      const result = await service.findManyByUserId('user-1');
      expect(result.entity_list.length).toBeGreaterThan(0);
      expect(result.images.length).toBeGreaterThan(0);
    });

    it('should throw if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      await expect(service.findManyByUserId('invalid')).rejects.toThrow(EntityNotFoundError);
    });
  });

  describe('delete', () => {
    it('should delete image if exists', async () => {
      const image = { Id: 'img-1' };
      mockPrisma.image.findUnique.mockResolvedValue(image);
      mockPrisma.image_processing.deleteMany.mockResolvedValue(undefined);
      mockPrisma.image.delete.mockResolvedValue(image);

      const result = await service.delete('img-1');
      expect(result).toEqual(image);
    });

    it('should throw if image not found', async () => {
      mockPrisma.image.findUnique.mockResolvedValue(null);
      await expect(service.delete('missing')).rejects.toThrow(EntityNotFoundError);
    });
  });

  describe('sendFavorites', () => {
    it('should return favorite images', async () => {
      const favorites = [{ Id: 'img-1' }];
      mockPrisma.user.findUnique.mockResolvedValue({ email: 'a@a.com', name: 'Alice' });
      mockPrisma.image.findMany.mockResolvedValue(favorites);

      const result = await service.sendFavorites('user-1');
      expect(result).toEqual(favorites);
    });

    it('should throw if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      await expect(service.sendFavorites('invalid')).rejects.toThrow(EntityNotFoundError);
    });
  });

  describe('updateImage', () => {
    it('should update image', async () => {
      const image = { Id: 'img-1' };
      mockPrisma.image.findUnique.mockResolvedValue(image);
      mockPrisma.image.update.mockResolvedValue(undefined);

      const result = await service.updateImage({ imageId: 'img-1', user_favorite: true });
      expect(result).toEqual(image);
    });

    it('should throw if image not found', async () => {
      mockPrisma.image.findUnique.mockResolvedValue(null);
      await expect(service.updateImage({ imageId: 'missing' })).rejects.toThrow(EntityNotFoundError);
    });
  });
});
