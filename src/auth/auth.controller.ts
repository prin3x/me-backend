import {
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
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

  @Get('/checkauth')
  @UseGuards(JwtAuthGuard)
  checkAuthUser(@AuthPayload() user) {
    if (!user) throw new UnauthorizedException();
    return user;
  }

  @Post('/change-password')
  @UseGuards(JwtAuthGuard)
  changePassword(@Body() user) {
    return this.authService.changePassword(user);
  }
}
