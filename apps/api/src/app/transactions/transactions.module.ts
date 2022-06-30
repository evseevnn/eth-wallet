import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from './entities/transaction.entity';
import { TransactionsService } from './transactions.service';
import { TransactionsResolver } from './transactions.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  providers: [TransactionsService, TransactionsResolver],
})
export class TransactionsModule {}
