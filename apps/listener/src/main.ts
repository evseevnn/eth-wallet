/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app/app.module';
import { EthereumEmiter } from './app/ethereum-emitter';
import { WalletService } from './app/wallets.service';
import { TransactionsService } from './app/transactions.service';
import { Transaction, TransactionStatus } from '@fonbnk/database';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule
  );

  const walletService = app.get<WalletService>(WalletService);
  const transactionsService = app.get<TransactionsService>(TransactionsService);
  const ethereumEmitter = app.get<EthereumEmiter>(EthereumEmiter);

  // Listening for pending transactions
  ethereumEmitter.on('pending', (transaction) => {
    // After get new transaction we should save it to database
    const tx = new Transaction();
    tx.block = transaction.blockNumber;
    tx.hash = transaction.hash;
    tx.from = transaction.from;
    tx.to = transaction.to;
    tx.status = TransactionStatus.PENDING;
    tx.amount = transaction.value.toString();
    transactionsService.upsert(tx);
  });

  // Listening for new transactions
  ethereumEmitter.on('completed', (transaction) => {
    // After get new transaction we should save it to database
    const tx = new Transaction();
    tx.block = transaction.blockNumber;
    tx.hash = transaction.hash;
    tx.from = transaction.from;
    tx.to = transaction.to;
    tx.status = TransactionStatus.COMPLETED;
    tx.amount = transaction.value.toString();
    transactionsService.upsert(tx);
  });

  // Listening for new transactions
  ethereumEmitter.on('balance', async (address, balance) => {
    // After get new transaction we should save it to database
    console.log(`Update balance for address ${address} to ${balance} wei`);
    await walletService.setWalletBalance(address, balance);
  });

  // Can be good idea for mongodb replica
  // walletService.onChange((data) => {
  //   console.log(data);
  // });

  // Interval update addresses
  setInterval(async () => {
    const addresses = await walletService.getAllWalletsAddresses();
    ethereumEmitter.setTracingAddresses(addresses);
  }, 5000);
}
bootstrap();
