import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminsService } from 'admins/admins.service';
import { StaffContactsService } from 'staff-contacts/staff-contacts.service';
import { UsersService } from 'users/users.service';

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

  async validateUser(id): Promise<any> {
    const user = await this.staffService.findOne(id);
    if (user && user.id === id) {
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
    const _user = await this.userService.findOne(user.email);
    const payload = { username: _user.username, id: _user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
