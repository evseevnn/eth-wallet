import { Button, Code, Title } from '@mantine/core';
import { CurrencyEthereum } from 'tabler-icons-react';
import AssetCard from '../components/asset-card/asset-card';
import { useAppContext } from '../context/state';
import withAuth from '../decorators/withAuth';
import DefaultLayout from '../layouts/DefaultLayout';

export function Index() {
  // Getting user balance
  const context = useAppContext();

  return (
    <DefaultLayout>
      <AssetCard
        name="Ethereum"
        address={context.user.wallet.address}
        balance={context.user.wallet.balance}
        icon={CurrencyEthereum}
      />
    </DefaultLayout>
  );
}

export default withAuth(Index);
