import { Inject, Injectable } from '@nestjs/common';
import EventEmitter = require('events');
import { providers } from 'ethers';

@Injectable()
export class EthereumEmiter extends EventEmitter {
  /**
   * Addresses for filtering transactions
   */
  private tracingAddresses: string[] = [];

  constructor(
    @Inject('ETHEREUM_NETWORK_PROVIDER')
    private provider: providers.BaseProvider
  ) {
    super();
    // Tracing new blocks
    this.provider.on('block', (blockNumber) =>
      this.newBlocklistener(blockNumber)
    );

    // Tracing pending transactions
    this.provider.on('pending', (txHash) =>
      this.pendingTransactionslistener(txHash)
    );

    // Tracing errors
    this.provider.on('error', (data) => this.emit('error', data));
  }

  private async pendingTransactionslistener(txHash: string) {
    const transaction = await this.provider.getTransaction(txHash);
    if (
      transaction &&
      (this.tracingAddresses.includes(transaction.from) ||
        this.tracingAddresses.includes(transaction.to))
    ) {
      this.emit('pending', transaction);
    }
  }

  private async newBlocklistener(blockNumber: number) {
    const blockWithTransactions = await this.provider.getBlockWithTransactions(
      blockNumber
    );

    // Transactions filtering
    const transactions = blockWithTransactions.transactions.filter(
      (transaction) =>
        this.tracingAddresses.includes(transaction.from) ||
        this.tracingAddresses.includes(transaction.to)
    );

    console.log(
      `[${blockNumber}] Incoming ${transactions.length} transactions for ${this.tracingAddresses.length} addresses`
    );

    transactions.map((transaction) => {
      this.emit('completed', transaction);
      // Update balances
      [(transaction.from, transaction.to)]
        .filter((address) => this.tracingAddresses.includes(address))
        .map((address) => this.updateBalance(address));
    });
  }

  private async updateBalance(address: string) {
    const balance = await this.provider.getBalance(address);
    this.emit('balance', address, balance);
  }

  setTracingAddresses(addresses: string[]) {
    this.tracingAddresses = addresses;
  }
}
