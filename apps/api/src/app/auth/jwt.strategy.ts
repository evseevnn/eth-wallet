import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtDto } from './dto/jwt.dto';
import { environment } from '../../environments/environment';
import { User } from '../users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: environment.bcryptSaltOrRound,
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
