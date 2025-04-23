import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { mailService } from './mail.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/shared/prisma/PrismaService';

@Module({
    imports:[
        PassportModule,
        JwtModule.register({
              secret: process.env.JWT_SECRET,
              signOptions: { expiresIn: '30d' },
        }),
    ],
    providers:[AuthService,JwtService,JwtStrategy,mailService,PrismaService],
    exports:[AuthService],
    controllers: [AuthController]
})
export class AuthModule {}
