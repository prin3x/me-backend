import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/admin/login')
  adminLogin(@Body() user) {
    return this.authService.loginAdmin(user);
  }

  @Post('/user/login')
  userLogin(@Body() user) {
    return this.authService.loginUser(user);
  }
}
