import { Module } from '@nestjs/common';
import { ProcessService } from './process.service';
import { ProcessController } from './process.controller';
import { PrismaService } from 'src/shared/prisma/PrismaService';
import { ImageService } from '../image/image.service';
import { FileService } from '../file/file.service';
import { SupabaseService } from '../image/supabase.service';
import { UserService } from '../user/user.service';
import { DefinedController } from './defined.controller';


@Module({
  providers: [ProcessService,PrismaService,ImageService,FileService,SupabaseService,UserService],
  controllers: [ProcessController, DefinedController]
})
export class ProcessModule {}
