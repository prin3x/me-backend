import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

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
      if (i === 'user') {
        result = !!user.hash;
      }
      if (result) return result;
      if (i === 'admin') {
        result = !!user.username;
      }
    }
    return result;
  }
}
