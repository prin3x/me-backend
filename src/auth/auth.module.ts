import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AdminsModule } from 'admins/admins.module';
import { UsersModule } from 'users/users.module';
import { StaffContact } from 'staff-contacts/entities/staff-contact.entity';
import { StaffContactsModule } from 'staff-contacts/staff-contacts.module';

@Module({
  imports: [
    UsersModule,
    AdminsModule,
    PassportModule,
    StaffContactsModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '10d' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
