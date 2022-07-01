import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wallet } from '@fonbnk/database';
import { BigNumber } from 'ethers';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Wallet.name)
    private readonly walletModel: Model<Wallet>
  ) {}

  // TODO(nikolai): Useful in case when we use mongo with replication
  // onChange(callback: Function) {
  //   this.walletModel.watch().on('change', (data) => callback(data));
  // }

  async getAllWalletsAddresses(): Promise<string[]> {
    const addresses: string[] = await this.walletModel
      .find()
      .distinct('address');

    return addresses;
  }

  async setWalletBalance(address: string, newBalance: BigNumber) {
    await this.walletModel.findOneAndUpdate(
      { address },
      { $set: { balance: newBalance } }
    );
  }
}
