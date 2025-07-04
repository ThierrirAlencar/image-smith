import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { PrismaService } from 'src/shared/prisma/PrismaService';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { FileService } from '../file/file.service';
import { SupabaseService } from '../supabase/supabase.service';
import { UserService } from '../user/user.service';

@Module({
  providers: [ImageService,PrismaService,AuthService,JwtService,FileService,SupabaseService,UserService],
  controllers: [ImageController],
  exports:[SupabaseService]
})

export class ImageModule {}
