import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtStrategy } from './modules/auth/jwt.strategy';
import { ImageModule } from './modules/image/image.module';
import { ProcessModule } from './modules/process/process.module';
import { FileModule } from './modules/file/file.module';
import { replicateModule } from './modules/replicate/replicate.module';



@Module({
  imports: [
    UserModule, AuthModule, ImageModule, ProcessModule, FileModule , replicateModule
  ],
  providers: [JwtStrategy],
})
export class AppModule {}
