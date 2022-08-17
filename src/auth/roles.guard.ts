import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export enum ADMIN_ROLES {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'superAdmin',
  HOST = 'host',
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    let result;
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    for (const i of roles) {
      if (i === ADMIN_ROLES.USER) {
        result = !!user.username;
      }
      if (result) return result;
      if (i === ADMIN_ROLES.ADMIN) {
        result =
          user.role === ADMIN_ROLES.ADMIN ||
          user.role === ADMIN_ROLES.SUPER_ADMIN;
      }
      if (result) return result;
      if (i === ADMIN_ROLES.SUPER_ADMIN) {
        result = user.role === ADMIN_ROLES.SUPER_ADMIN;
      }
    }
    if (user.role === ADMIN_ROLES.HOST) {
      result = true;
    }
    return result;
  }
}
