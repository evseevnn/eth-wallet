import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ethers, providers, Wallet as EtherWallet } from 'ethers';
import { EncryptionService } from 'libs/enctyption/src/lib/encryption.service';
import { EncryptedData } from '@fonbnk/types';
import { Wallet } from '@fonbnk/database';

@Injectable()
export class WalletService {
  constructor(
    @Inject('ETHEREUM_NETWORK_PROVIDER')
    private readonly ethereumNetworkProvider:
      | providers.BaseProvider
      | providers.InfuraWebSocketProvider,
    @InjectModel(Wallet.name)
    private readonly walletModel: Model<Wallet>,
    private readonly encryptionService: EncryptionService
  ) {}

  async getWallet(address: string, passphrase: string): Promise<ethers.Wallet> {
    const walletModel = await this.walletModel.findOne({ address }).lean();

    // Getting private key
    const encryptedData = <EncryptedData>walletModel.encrypted_pk;
    const pk = await this.encryptionService.decrypt(encryptedData, passphrase);

    return new ethers.Wallet(pk, this.ethereumNetworkProvider);
  }

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
