import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from '@fonbnk/database';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<Transaction>
  ) {}

  /**
   * Will create new or update transaction by transaction hash
   * @param transaction
   * @returns
   */
  async upsert(transaction: Transaction) {
    const newTransaction = await this.transactionModel.findOneAndUpdate(
      { hash: transaction.hash },
      transaction,
      { upsert: true }
    );
    return newTransaction;
  }
}
