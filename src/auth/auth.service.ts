import {
  HttpException,
  HttpStatus,
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { AdminsService } from 'admins/admins.service';
import { StaffContactsService } from 'staff-contacts/staff-contacts.service';
import { UsersService } from 'users/users.service';
import * as bcrypt from 'bcrypt';
import { IAuthPayload } from './auth.decorator';
import { ConfigService } from '@nestjs/config';
import { StaffContact } from 'staff-contacts/entities/staff-contact.entity';

@Injectable()
export class AuthService {
  constructor(
    private adminService: AdminsService,
    private userService: UsersService,
    private jwtService: JwtService,
    private staffService: StaffContactsService,
    private config: ConfigService,
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
        payload = {
          username: _user.email,
          id: _user.id,
          name: _user.name,
          profilePicUrl: _user.profilePicUrl,
        };
      }
    } catch (e) {
      throw new UnauthorizedException('Unable to login user');
    }
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async checkExpiry(user: IAuthPayload) {
    try {
      // const pastFifteenMin = user.iat * 1000 + 1000 * 60 * 15;
      // if (pastFifteenMin < new Date().getTime()) {
      //   throw new UnauthorizedException('Reach time limit please login again');
      // }

      return {
        accessToken: this.jwtService.sign(
          { ...user },
          {
            secret: this.config.get<string>('jwt.jwtSecret'),
            expiresIn: 10 * 60 + 's',
          },
        ),
      };
    } catch (error) {
      throw new UnauthorizedException('Reach time limit please login again');
    }
  }
  async checkAuthAndProlongToken(token: string) {
    try {
      const decoded = this.jwtService.decode(token) as IAuthPayload;
      if (!decoded) {
        throw new Error();
      }

      return {
        accessToken: this.jwtService.sign(decoded),
      };
    } catch (error) {
      throw new Error('Error Token');
    }
  }

  async changePassword(user: any) {
    const _user = await this.staffService.findOneByEmail(user.email);
    return await this.staffService.changePassword(_user.id, user.newPassword);
  }

  async createAccessTokenFromRefreshToken(refreshToken: string) {
    try {
      const decoded = this.jwtService.decode(refreshToken) as IAuthPayload;
      if (!decoded) {
        throw new Error();
      }
      const user = await this.staffService.findOne(`${decoded.id}`);
      if (!user) {
        throw new HttpException(
          'User with this id does not exist',
          HttpStatus.NOT_FOUND,
        );
      }
      const isRefreshTokenMatching = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );
      if (!isRefreshTokenMatching) {
        throw new UnauthorizedException('Invalid token');
      }
      await this.jwtService.verifyAsync(
        refreshToken,
        this.getRefreshTokenOptions(user),
      );
      return this.loginUser(user);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
  getRefreshTokenOptions(user: StaffContact): JwtSignOptions {
    return this.getTokenOptions('refresh', user);
  }

  private getTokenOptions(type: string, user: StaffContact) {
    const options: JwtSignOptions = {
      secret: this.config.get('refreshToken.jwtSecret'),
    };
    const expiration: string = 15 * 60 + 's';
    if (expiration) {
      options.expiresIn = expiration;
    }
    return options;
  }

  async removeRefreshToken(email: string) {
    return this.staffService.removeRefreshToken(email);
  }
}
