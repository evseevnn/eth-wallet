import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wallet } from './entities/wallet.entity';
import { ethers, Wallet as EtherWallet } from 'ethers';
import { EncryptionService } from 'libs/enctyption/src/lib/encryption.service';
import { EncryptedData } from '@fonbnk/types';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Wallet.name)
    private readonly walletModel: Model<Wallet>,
    private readonly encryptionService: EncryptionService
  ) {}

  async create(
    passphrase: string
  ): Promise<{ wallet: Wallet; mnemonic: string }> {
    // Get wallet data
    const walletData: EtherWallet = ethers.Wallet.createRandom();

    // Get encrypted pk
    const encPrivateKey: EncryptedData = await this.encryptionService.encrypt(
      walletData.privateKey,
      passphrase
    );

    // Save wallet to database
    const wallet = await this.walletModel.create({
      address: walletData.address,
      encrypted_pk: encPrivateKey,
    });

    return { wallet, mnemonic: walletData.mnemonic.phrase };
  }
}
