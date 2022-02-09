import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminsService } from 'admins/admins.service';
import { StaffContactsService } from 'staff-contacts/staff-contacts.service';
import { UsersService } from 'users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private adminService: AdminsService,
    private userService: UsersService,
    private jwtService: JwtService,
    private staffService: StaffContactsService,
  ) {}

  async validateAdmin(username: string, pass: string): Promise<any> {
    const user = await this.adminService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.staffService.findOneByEmail(email);
    const isMatch = await bcrypt.compare(password, user.hash);
    if (user && isMatch) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  async loginAdmin(user: any) {
    const _user = await this.adminService.findOne(user.username);
    const payload = { username: _user.username, id: _user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async loginUser(user: any) {
    const _user = await this.staffService.findOneByEmail(user.email);
    const payload = { username: _user.email, id: _user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
