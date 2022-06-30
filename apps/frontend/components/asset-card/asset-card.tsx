import styled from '@emotion/styled';
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Input,
  Paper,
  Text,
  Title,
} from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { Check, Copy, Icon } from 'tabler-icons-react';

/* eslint-disable-next-line */
export interface AssetCardProps {
  name: string;
  address: string;
  icon: Icon;
  balance: string;
}

const StyledAssetCard = styled.div`
  color: pink;
`;

export function AssetCard({ name, address, balance, icon }: AssetCardProps) {
  const clipboard = useClipboard({ timeout: 500 });

  const copyAddressButton = (
    <ActionIcon size="xs" radius="xl" variant="transparent">
      {clipboard.copied ? (
        <Check size={10} />
      ) : (
        <Copy onClick={() => clipboard.copy(address)} size={10} />
      )}
    </ActionIcon>
  );

  return (
    <Paper withBorder p="md" radius="xs" key="ethereum">
      <Title order={3}>
        {balance} {name}
      </Title>

      <Badge
        variant="light"
        sx={{ paddingRight: 3 }}
        rightSection={copyAddressButton}
      >
        <Text size="xs" transform="none">
          {address}
        </Text>
      </Badge>

      <Group align="flex-end" spacing="xs" mt={25}>
        <Button>Send</Button>
      </Group>
    </Paper>
  );
}

export default AssetCard;
