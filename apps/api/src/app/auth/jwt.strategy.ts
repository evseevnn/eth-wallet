import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtDto } from './dto/jwt.dto';
import { environment } from '../../environments/environment';
import { User } from '@fonbnk/database';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: environment.JWT_ACCESS_SECRET,
    });
  }

  async validate(payload: JwtDto): Promise<User> {
    const user = await this.authService.validateUser(payload.uid);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
