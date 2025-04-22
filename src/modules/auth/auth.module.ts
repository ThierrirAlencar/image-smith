import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports:[
        PassportModule,
        JwtModule.register({
              secret: process.env.JWT_SECRET,
              signOptions: { expiresIn: '30d' },
        }),
    ],
    providers:[AuthService,JwtService,JwtStrategy],
    exports:[AuthService]
})
export class AuthModule {}
