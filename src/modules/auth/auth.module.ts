import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
    imports:[
        PassportModule,
        JwtModule.register({
              secret: "IMAGEFORGE",
              signOptions: { expiresIn: '30d' },
        }),
    ],
    providers:[AuthService,JwtService],
    exports:[AuthService]
})
export class AuthModule {}
