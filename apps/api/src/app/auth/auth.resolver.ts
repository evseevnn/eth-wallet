import {
  Resolver,
  Mutation,
  Args,
  Parent,
  ResolveField,
} from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './models/auth.model';
import { Token } from './models/token.model';
import { LoginInput } from './dto/login.input';
import { SignupInput } from './dto/signup.input';
import { RefreshTokenInput } from './dto/refresh-token.input';
import { User } from '@fonbnk/database';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly auth: AuthService) {}

  @Mutation(() => Auth)
  async signup(@Args('input') input: SignupInput) {
    input.email = input.email.toLowerCase();
    const {
      tokens: { accessToken, refreshToken },
      mnemonic,
    } = await this.auth.createUser(input);

    return {
      mnemonic,
      accessToken,
      refreshToken,
    };
  }

  @Mutation(() => Auth)
  async login(@Args('input') { email, password }: LoginInput) {
    const { accessToken, refreshToken } = await this.auth.login(
      email.toLowerCase(),
      password
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  @Mutation(() => Token)
  async refreshToken(@Args() { token }: RefreshTokenInput) {
    return this.auth.refreshToken(token);
  }

  @ResolveField('user', () => User)
  async user(@Parent() auth: Auth) {
    return await this.auth.getUserFromToken(auth.accessToken);
  }
}
