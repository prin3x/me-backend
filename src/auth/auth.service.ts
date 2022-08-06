import {
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
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

  async validateUser(id): Promise<any> {
    const user = await this.staffService.findOne(id);
    if (user) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  async loginAdmin(user: any) {
    let payload;
    try {
      const _admin = await this.adminService.findOne(user.username);
      const isValid = await this.staffService.comparePassword(
        user.password,
        _admin.password,
      );

      if (isValid) {
        payload = {
          username: _admin.username,
          id: _admin.id,
          role: _admin.role,
        };
      }
    } catch (e) {
      throw new UnauthorizedException('Unable to login user');
    }
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async registerAdmin(user: any) {
    let payload;
    try {
      const _admin = await this.adminService.findOne(user.username);

      if (_admin) throw new NotAcceptableException('Duplicated Id');

      payload = await this.adminService.regisAdmin(user);
    } catch (e) {
      throw new UnauthorizedException('Unable to login user');
    }
    return { accessToken: payload };
  }

  async loginUser(user: any) {
    let payload;
    try {
      const _user = await this.staffService.findOneByEmail(user.email);
      const isValid = await this.staffService.comparePassword(
        user.password,
        _user.hash,
      );

      if (isValid) {
        payload = { username: _user.email, id: _user.id };
      }
    } catch (e) {
      throw new UnauthorizedException('Unable to login user');
    }
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async changePassword(user: any) {
    const _user = await this.staffService.findOneByEmail(user.email);
    return await this.staffService.changePassword(_user.id, user.newPassword);
  }
}
