import { Transaction, TransactionStatus, User } from '@fonbnk/database';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BigNumber, ethers } from 'ethers';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { environment } from '../../environments/environment';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { WalletService } from '../wallet/wallet.service';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { TransactionsService } from './transactions.service';

@Resolver()
export class TransactionsResolver {
  constructor(
    private readonly walletService: WalletService,
    private readonly transactionsService: TransactionsService
  ) {}

  @Query(() => [Transaction])
  @UseGuards(GqlAuthGuard)
  async transactions(@CurrentUser() user: User): Promise<Array<Transaction>> {
    const transactions =
      await this.transactionsService.getTransactionsByAddress(
        user.wallet.address
      );

    return transactions;
  }

  @Mutation(() => Transaction)
  @UseGuards(GqlAuthGuard)
  async sendTransaction(
    @CurrentUser() user: User,
    @Args('input') input: CreateTransactionInput
  ) {
    const amountInEth = ethers.utils.parseEther(input.amount);

    if (BigNumber.from(user.wallet.balance).lte(amountInEth)) {
      throw new BadRequestException('Insufficient balance');
    }

    // Getting wallet
    const wallet = await this.walletService.getWallet(
      user.wallet.address,
      input.password
    );

    // Estimate gas
    const gasLimit = wallet.estimateGas({
      to: input.address,
      value: ethers.utils.parseEther(input.amount),
    });

    // Send transaction
    console.log('Mining transaction...');
    const tx = await wallet.sendTransaction({
      to: input.address,
      value: ethers.utils.parseEther(input.amount),
      gasLimit,
      nonce: wallet.getTransactionCount(),
    });

    console.log(
      `https://${environment.ETHEREUM_NETWORK}.etherscan.io/tx/${tx.hash}`
    );

    // Save transaction to database
    const newTransaction = new Transaction();
    newTransaction.hash = tx.hash;
    newTransaction.from = tx.from;
    newTransaction.to = tx.to;
    newTransaction.amount = tx.value.toString();
    newTransaction.status = TransactionStatus.PENDING;

    const transaction = await this.transactionsService.upsert(newTransaction);
    return transaction;
  }
}
