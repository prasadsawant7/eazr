import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../types';
import jwtConfig from 'src/config/jwt.config';

@Injectable()
export class ATStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    console.log(jwtConfig().atSecret);

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfig().atSecret,
    });
  }

  validate(payload: JwtPayload) {
    return payload;
  }
}
