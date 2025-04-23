import { Module } from '@nestjs/common';
import { ProcessService } from './process.service';
import { ProcessController } from './process.controller';
import { PrismaService } from 'src/shared/prisma/PrismaService';
import { ImageService } from '../image/image.service';
import { FileService } from '../file/file.service';

@Module({
  providers: [ProcessService,PrismaService,ImageService,FileService],
  controllers: [ProcessController]
})
export class ProcessModule {}
