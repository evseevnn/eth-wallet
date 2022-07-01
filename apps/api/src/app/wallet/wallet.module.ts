import { Wallet, WalletSchema } from '@fonbnk/database';
import { EnctyptionModule } from '@fonbnk/enctyption';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { providers } from 'ethers';
import { environment } from '../../environments/environment';
import { WalletService } from './wallet.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Wallet.name, schema: WalletSchema }]),
    EnctyptionModule.register({ secret: environment.PK_ENCRYPTOR_SECRET }),
  ],
  providers: [
    {
      provide: 'ETHEREUM_NETWORK_PROVIDER',
      useFactory: () => {
        const provider = new providers.InfuraWebSocketProvider(
          environment.ETHEREUM_NETWORK,
          environment.INFURA_KEY
        );
        return provider;
      },
    },
    WalletService,
  ],
  exports: [WalletService],
})
export class WalletModule {}
