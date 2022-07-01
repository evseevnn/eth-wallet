import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from '@fonbnk/database';
import { WalletService } from '../wallet/wallet.service';
import { BigNumber, ethers, Wallet } from 'ethers';
import { environment } from '../../environments/environment';

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

  async getTransactionsByAddress(address: string): Promise<Transaction[]> {
    const transactions = await this.transactionModel
      .find({
        $or: [{ from: address }, { to: address }],
      })
      .lean();

    return transactions;
  }
}
