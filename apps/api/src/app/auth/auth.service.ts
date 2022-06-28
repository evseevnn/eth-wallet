import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from './password.service';
import { SignupInput } from './dto/signup.input';
import { Token } from './models/token.model';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { environment } from '../../environments/environment';
import { JwtDto } from './dto/jwt.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService
  ) {}

  async createUser(payload: SignupInput): Promise<Token> {
    const hashedPassword = await this.passwordService.hashPassword(
      payload.password
    );

    const user = await this.usersService.create({
      ...payload,
      password: hashedPassword,
    });

    return this.generateTokens(user._id.toString());
  }

  async login(email: string, password: string): Promise<Token> {
    const user = await this.usersService.findOne({ email });

    if (!user) {
      throw new BadRequestException('LOGIN_FAILED');
    }

    const passwordValid = await this.passwordService.validatePassword(
      password,
      user.password
    );

    if (!passwordValid) {
      throw new BadRequestException('LOGIN_FAILED');
    }

    return this.generateTokens(user._id.toString());
  }

  validateUser(userId: string): Promise<User> {
    return this.usersService.findById(userId);
  }

  getUserFromToken(token: string): Promise<User> {
    const tokenBody = this.jwtService.decode(token);
    if (typeof tokenBody !== 'object') {
      return null;
    }
    return this.usersService.findById(tokenBody.uid);
  }

  generateTokens(userId: string): Token {
    return {
      accessToken: this.generateAccessToken(userId),
      refreshToken: this.generateRefreshToken(userId),
    };
  }

  private generateAccessToken(userId: string): string {
    const payload: Partial<JwtDto> = { uid: userId };
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(userId: string): string {
    const payload: Partial<JwtDto> = { uid: userId };
    return this.jwtService.sign(payload, {
      secret: environment.jwtRefreshSecret,
      expiresIn: environment.refreshIn,
    });
  }

  refreshToken(token: string) {
    try {
      const { userId } = this.jwtService.verify(token, {
        secret: environment.jwtRefreshSecret,
      });

      return this.generateTokens(userId);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}