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
import { environment } from '../../environments/environment';
import { JwtDto } from './dto/jwt.dto';
import { WalletService } from '../wallet/wallet.service';
import { User } from '@fonbnk/database';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly walletService: WalletService,
    private readonly passwordService: PasswordService
  ) {}

  async createUser(
    payload: SignupInput
  ): Promise<{ tokens: Token; mnemonic: string }> {
    const hashedPassword = await this.passwordService.hashPassword(
      payload.password
    );

    const { wallet, mnemonic } = await this.walletService.create(
      payload.password
    );

    const user = await this.usersService.create(
      {
        ...payload,
        password: hashedPassword,
      },
      wallet
    );

    const tokens = this.generateTokens(user._id.toString());
    return { tokens, mnemonic };
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
      secret: environment.JWT_REFRESH_SECRET,
      expiresIn: environment.JWT_REFRESH_IN,
    });
  }

  refreshToken(token: string) {
    try {
      const { userId } = this.jwtService.verify(token, {
        secret: environment.JWT_REFRESH_SECRET,
      });

      return this.generateTokens(userId);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
