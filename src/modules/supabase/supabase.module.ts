import { Module } from '@nestjs/common';
import { SupabaseService } from './supabase.service';

@Module({
  providers: [],
  controllers: [],
  exports:[SupabaseService]
})

export class ImageModule {}
