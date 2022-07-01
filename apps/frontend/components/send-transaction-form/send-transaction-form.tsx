import {
  Box,
  Button,
  Group,
  LoadingOverlay,
  NumberInput,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  Wallet,
  useSendTransactionMutation,
} from 'apps/frontend/generated/graphql';
import { BigNumber } from 'ethers';
import { formatEther, isAddress, parseUnits } from 'ethers/lib/utils';

/* eslint-disable-next-line */
export interface SendTransactionFormProps {
  userWallet: Wallet;
}

export function SendTransactionForm({ userWallet }: SendTransactionFormProps) {
  const form = useForm({
    initialValues: {
      address: '',
      amount: '0.0',
      password: '',
    },
    validate: {
      amount: (value) => {
        return BigNumber.from(userWallet.balance).gt(
          parseUnits(value.toString(), 'ether')
        )
          ? null
          : 'Insufficient funds';
      },
      address: (value: string) => (isAddress(value) ? null : 'Invalid address'),
    },
  });

  const [submitHandler, { loading, error }] = useSendTransactionMutation({
    variables: { ...form.values, amount: form.values.amount.toString() },
    onError: (error) => {
      alert(error);
    },
    onCompleted: (data) => {
      alert(data.sendTransaction.hash);
    },
  });

  const balanceInEth = formatEther(BigNumber.from(userWallet.balance));

  return (
    <Box sx={{ maxWidth: 300 }} mt="lg">
      <form onSubmit={form.onSubmit(() => submitHandler())}>
        <LoadingOverlay visible={loading} />

        <TextInput
          mb="sm"
          required
          label="Eth address of recipient"
          placeholder="0xabcdf"
          {...form.getInputProps('address')}
        />

        <NumberInput
          mb="sm"
          required
          label="Amount in Eth"
          defaultValue={0.0}
          min={0.01}
          max={parseFloat(balanceInEth)}
          step={0.01}
          precision={2}
          {...form.getInputProps('amount')}
        />

        <TextInput
          mb="sm"
          required
          label="Password"
          placeholder="***"
          {...form.getInputProps('password')}
        />

        <Group position="apart" mt="xl">
          <Button type="submit">Send</Button>
        </Group>
      </form>
    </Box>
  );
}

export default SendTransactionForm;
