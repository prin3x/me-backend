import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface IAuthPayload {
  id: number;
  profilePicUrl: string;
  name: string;
  nameTH: string;
  nickname: string;
  company: string;
  department: string;
  division: string;
  ipPhone: string;
  email: string;
  position: string;
  staffId: string;
  status: string;
  birthDate: Date;
  hash: string;
  createdBy: number;
  createdDate: Date;
  updatedDate: Date;
}

export const AuthPayload = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
