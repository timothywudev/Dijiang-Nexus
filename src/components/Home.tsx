import { Flex, Stack, Text, Title } from '@mantine/core';
import styles from './styles/Home.module.css';
export default function Home() {
  return (
    <Flex p={'xl'} direction={'column'} className={styles.homePage}>
      <Title order={1}>Welcome to Dijiang Nexus</Title>
      <Text>Adjust your exploration level in the settings before usage.</Text>
      <Text>
        This is a work-in-progress tool to assist with the tracking and
        gathering of Endfield's rare resources.
      </Text>

      <Stack className={styles.homeBox} gap={0} mt={'2em'}>
        <Title order={2}>Todo List</Title>
        <Text>
          <ul>
            <li>More UI/UX improvements</li>
            <li>Interactive Map for easier resource reference and checking</li>
            <li>General Daily Checklist</li>
            <li>Recycling Stations?</li>
            <li>Weekly Checklist?</li>
          </ul>
        </Text>
      </Stack>
    </Flex>
  );
}
