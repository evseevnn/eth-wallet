import { UseGuards } from '@nestjs/common';
import { Resolver, Query } from '@nestjs/graphql';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver()
@UseGuards(GqlAuthGuard)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => User)
  me(): User {
    return null;
  }
}
