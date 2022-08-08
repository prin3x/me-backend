import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { StaffContact } from 'staff-contacts/entities/staff-contact.entity';
import { AuthPayload } from './auth.decorator';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth-guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/admin/register')
  registerAdmin(@Body() admin) {
    return this.authService.registerAdmin(admin);
  }

  @Post('/admin/login')
  adminLogin(@Body() admin) {
    return this.authService.loginAdmin(admin);
  }

  @Post('/user/login')
  userLogin(@Body() user) {
    return this.authService.loginUser(user);
  }

  @Get('log-out')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async logOut(user: StaffContact) {
    await this.authService.removeRefreshToken(user.email);
  }

  @Get('/checkauth')
  @UseGuards(JwtAuthGuard)
  checkAuthUser(@AuthPayload() user) {
    if (!user) throw new UnauthorizedException();
    return user;
  }

  @Post('/checktoken')
  @UseGuards(JwtAuthGuard)
  checkToken(@Body('token') token: string) {
    return this.authService.checkAuthAndProlongToken(token);
  }

  @Post('/change-password')
  @UseGuards(JwtAuthGuard)
  changePassword(@Body() user) {
    return this.authService.changePassword(user);
  }
}
