import {
  Transaction,
  TransactionSchema,
  Wallet,
  WalletSchema,
} from '@fonbnk/database';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { providers } from 'ethers';
import { environment } from '../environments/environment';

import { EthereumEmiter } from './ethereum-emitter';
import { TransactionsService } from './transactions.service';
import { WalletService } from './wallets.service';

@Module({
  imports: [
    MongooseModule.forRoot(environment.MONGODB_URL),
    MongooseModule.forFeature([
      { name: Wallet.name, schema: WalletSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  controllers: [],
  providers: [
    TransactionsService,
    WalletService,
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
    EthereumEmiter,
  ],
})
export class AppModule {}
