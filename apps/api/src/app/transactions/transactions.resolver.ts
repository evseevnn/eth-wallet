import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { User } from '../users/entities/user.entity';
import { Transaction } from './entities/transaction.entity';
import { TransactionsService } from './transactions.service';

@Resolver()
export class TransactionsResolver {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Query(() => [Transaction])
  @UseGuards(GqlAuthGuard)
  async transactions(@CurrentUser() user: User): Promise<Array<Transaction>> {
    const transactions =
      await this.transactionsService.getTransactionsByAddress(
        user.wallet.address
      );

    return transactions;
  }
}
