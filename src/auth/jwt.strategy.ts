import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService, config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('jwt.jwtSecret'),
      expiresIn: '12h',
    });
  }

  async validate(payload: any) {
    const user = {
      id: payload.id,
      username: payload.username,
      profilePicUrl: payload.profilePicUrl,
      name: payload.name,
      role: payload.role,
      hash: payload.hash,
      iat: payload.iat,
    };

    return user;
  }
}
