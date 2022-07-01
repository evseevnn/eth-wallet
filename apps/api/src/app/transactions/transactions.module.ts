import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsResolver } from './transactions.resolver';
import { Transaction, TransactionSchema } from '@fonbnk/database';
import { MongooseModule } from '@nestjs/mongoose';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    WalletModule,
  ],
  providers: [TransactionsService, TransactionsResolver],
})
export class TransactionsModule {}
