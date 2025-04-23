import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { ImageService } from '../image/image.service';
import { PrismaService } from 'src/shared/prisma/PrismaService';

@Module({
  controllers: [FileController],
  providers: [FileService,FileService,ImageService,PrismaService]
})
export class FileModule {}
