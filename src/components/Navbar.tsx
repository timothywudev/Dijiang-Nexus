import { useLocation, useNavigate } from 'react-router-dom';
import {
  Center,
  Stack,
  UnstyledButton,
  Image,
  Modal,
  Button,
  Accordion,
  Group,
  NumberInput,
  Affix,
  Text,
} from '@mantine/core';
import classes from './styles/Navbar.module.css';

import { IconHome2, IconMap, IconSettings } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useSettingsStore } from '../utils/playerStore';
import { useState } from 'react';
import { CountdownTimer } from '../utils/countdown';

interface NavbarLinkProps {
  icon: typeof IconHome2;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function NavbarLink({
  icon: Icon,
  label,
  active,
  onClick,
}: Readonly<NavbarLinkProps>) {
  return (
    <UnstyledButton
      onClick={onClick}
      className={classes.link}
      data-active={active || undefined}
      aria-label={label}
    >
      <Icon size={20} stroke={1.5} />
    </UnstyledButton>
  );
}

const linkData = [
  { icon: IconHome2, label: 'Home', path: '/' },
  { icon: IconMap, label: 'Regions', path: '/regions' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const links = linkData.map((link) => {
    const isActive =
      link.path === '/'
        ? location.pathname === '/'
        : location.pathname.startsWith(link.path);

    return (
      <NavbarLink
        {...link}
        key={link.label}
        active={isActive}
        onClick={() => navigate(link.path)}
      />
    );
  });

  const [settingsOpened, { open: openSettings, close: closeSettings }] =
    useDisclosure(false);
  const [
    openedVerifyDeletion,
    { open: openVerifyDeletion, close: closeVerifyDeletion },
  ] = useDisclosure(false);

  const { level, setLevel } = useSettingsStore();
  const [tempLevel, setTempLevel] = useState(() => level);

  const { hours, minutes, seconds } = CountdownTimer();

  return (
    <>
      <nav className={classes.navbar}>
        <Center>
          <Image
            src={`${import.meta.env.BASE_URL}slug.svg`}
            style={{ filter: 'invert(1)' }}
          />
        </Center>

        <div className={classes.navbarMain}>
          <Stack justify='center' gap={5}>
            {links}
          </Stack>
        </div>

        <Stack justify='center' gap={0}>
          <NavbarLink
            icon={IconSettings}
            label='Settings'
            onClick={openSettings}
          />
        </Stack>
      </nav>
      <Modal opened={settingsOpened} onClose={closeSettings} title='Settings'>
        <Stack>
          <NumberInput
            label='Exploration Level'
            value={tempLevel}
            onChange={(val) => setTempLevel(Number(val))}
            min={0}
            max={7}
            error={
              tempLevel < level
                ? 'Warning: This will lower the maximum number of resources!'
                : undefined
            }
          />
          <Accordion>
            <Accordion.Item value='0'>
              <Accordion.Control>Advanced</Accordion.Control>
              <Accordion.Panel>
                <Group justify='space-between'>
                  <Button w={'max-content'} disabled>
                    Export JSON
                  </Button>
                  <Button
                    w={'max-content'}
                    color='red'
                    onClick={openVerifyDeletion}
                  >
                    Reset
                  </Button>
                </Group>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>

          <Button
            w={'max-content'}
            ml={'auto'}
            onClick={() => {
              setLevel(tempLevel);
              closeSettings();
            }}
          >
            Save
          </Button>
        </Stack>
      </Modal>
      <Modal
        opened={openedVerifyDeletion}
        onClose={closeVerifyDeletion}
        title='Delete Data?'
      >
        <Stack>
          <Button
            onClick={() => {
              localStorage.clear();
              navigate('/');
              navigate(0);
            }}
          >
            Yes
          </Button>{' '}
          <Button onClick={closeVerifyDeletion}>No</Button>
        </Stack>
      </Modal>

      <Affix position={{ bottom: 20, right: 20 }}>
        <Text>
          Server Reset: {String(hours).padStart(2, '0')}:
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </Text>
      </Affix>
    </>
  );
}
