import { Container, createStyles, Header } from '@mantine/core';
import Logo from '../logo/logo';

const useStyles = createStyles((theme) => ({
  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 56,

    [theme.fn.smallerThan('sm')]: {
      justifyContent: 'flex-start',
    },
  },
}));

export function HeadNav() {
  const { classes, cx } = useStyles();

  return (
    <Header height={56} mb={45}>
      <Container className={classes.inner}>
        <Logo />
      </Container>
    </Header>
  );
}

export default HeadNav;
