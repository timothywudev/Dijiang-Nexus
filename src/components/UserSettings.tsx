import {
  Modal,
  Button,
  NumberInput,
  Stack,
  Group,
  Accordion,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import styles from './styles/UserSettings.module.css';
import { useSettingsStore } from '../utils/playerStore';
import { useState } from 'react';

export default function UserSettings() {
  const [openedSettings, { open: openSettings, close: closeSettings }] =
    useDisclosure(false);
  const [
    openedVerifyDeletion,
    { open: openVerifyDeletion, close: closeVerifyDeletion },
  ] = useDisclosure(false);

  const { level, setLevel } = useSettingsStore();
  const [tempLevel, setTempLevel] = useState(() => level);

  return (
    <>
      <Modal opened={openedSettings} onClose={closeSettings} title='Settings'>
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
          <Button>Yes</Button> <Button onClick={closeVerifyDeletion}>No</Button>
        </Stack>
      </Modal>
      <Button className={styles.modalOpenButton} onClick={openSettings}>
        Open Settings
      </Button>
    </>
  );
}
