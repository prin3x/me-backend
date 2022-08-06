import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AdminsModule } from 'admins/admins.module';
import { UsersModule } from 'users/users.module';
import { StaffContactsModule } from 'staff-contacts/staff-contacts.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from 'config/configuration';

@Module({
  imports: [
    UsersModule,
    AdminsModule,
    PassportModule,
    StaffContactsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('jwt.jwtSecret'),
        };
      },
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
