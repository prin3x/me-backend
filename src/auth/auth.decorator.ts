import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface IAuthPayload {
  id: number;
  username: string;
  name: string;
  iat?: number;
  role: string;
  profilePicUrl: string;
}

export const AuthPayload = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
