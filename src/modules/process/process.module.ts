import { Module } from '@nestjs/common';
import { ProcessService } from './process.service';
import { ProcessController } from './process.controller';
import { PrismaService } from 'src/shared/prisma/PrismaService';

@Module({
  providers: [ProcessService,PrismaService],
  controllers: [ProcessController]
})
export class ProcessModule {}
