import { Wallet, WalletSchema } from '@fonbnk/database';
import { EnctyptionModule } from '@fonbnk/enctyption';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { environment } from '../../environments/environment';
import { WalletService } from './wallet.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Wallet.name, schema: WalletSchema }]),
    EnctyptionModule.register({ secret: environment.PK_ENCRYPTOR_SECRET }),
  ],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}
