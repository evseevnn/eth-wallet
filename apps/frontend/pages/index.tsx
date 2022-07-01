import { Button, Code, Title } from '@mantine/core';
import { CurrencyEthereum } from 'tabler-icons-react';
import AssetCard from '../components/asset-card/asset-card';
import SendTransactionForm from '../components/send-transaction-form/send-transaction-form';
import { useAppContext } from '../context/state';
import withAuth from '../decorators/withAuth';
import DefaultLayout from '../layouts/DefaultLayout';

export function Index() {
  // Getting user balance
  const context = useAppContext();

  return (
    <DefaultLayout>
      <AssetCard
        name="Eth"
        address={context.user.wallet.address}
        balance={context.user.wallet.balance}
        icon={CurrencyEthereum}
      />
      <SendTransactionForm userWallet={context.user.wallet} />
    </DefaultLayout>
  );
}

export default withAuth(Index);
