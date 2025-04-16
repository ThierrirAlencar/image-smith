import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './modules/auth/jwt.strategy';


@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'sua-secret-key',
      signOptions: { expiresIn: '1d' },
    }),
    UserModule, AuthModule
  ],
  providers: [JwtStrategy],
})
export class AppModule {}
