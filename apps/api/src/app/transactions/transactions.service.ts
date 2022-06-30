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

  async getTransactionsByAddress(address: string): Promise<Transaction[]> {
    const transactions = await this.transactionModel
      .find({
        $or: [{ from: address }, { to: address }],
      })
      .lean();

    return transactions;
  }
}
