import { AppShell, Burger, Image, Flex, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Navbar from './Navbar';
import Main from './Content';
import { CountdownTimer } from '../utils/countdown';

export default function Shell() {
  const [opened, { toggle }] = useDisclosure();

  const { hours, minutes, seconds } = CountdownTimer();

  return (
    <AppShell
      padding='md'
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
    >
      <AppShell.Header>
        <Burger opened={opened} onClick={toggle} hiddenFrom='sm' size='sm' />
        <Flex h={'100%'} justify={'space-between'} align={'center'}>
          <Flex align={'center'}>
            <Image src='/slug.svg' h={50} w='auto' fit='contain' />
            <Title order={1}>Dijiang Nexus</Title>
          </Flex>
          {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:
          {String(seconds).padStart(2, '0')}
        </Flex>
      </AppShell.Header>

      <AppShell.Navbar>
        <Navbar />
      </AppShell.Navbar>

      <AppShell.Main>
        <Main />
      </AppShell.Main>
    </AppShell>
  );
}
