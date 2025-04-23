import { Module } from '@nestjs/common';
import { ProcessService } from './process.service';
import { ProcessController } from './process.controller';
import { PrismaService } from 'src/shared/prisma/PrismaService';
import { ImageService } from '../image/image.service';

@Module({
  providers: [ProcessService,PrismaService,ImageService],
  controllers: [ProcessController]
})
export class ProcessModule {}
