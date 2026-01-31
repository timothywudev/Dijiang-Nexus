import {
  Grid,
  NumberInput,
  Text,
  Image,
  Group,
  Title,
  Stack,
  Button,
} from '@mantine/core';
import { useDijiang } from '../utils/dijiangStore';
import { useResourceStore, useSettingsStore } from '../utils/playerStore';
import { useEffect } from 'react';

import styles from './styles/Content.module.css';
import { IconAlertTriangleFilled, IconMapPin } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';

export default function Main() {
  const { activeRegion, activeSubregion, isSubregion } = useDijiang();
  const { resourceValues, setResource } = useResourceStore();
  const { regrowLimit } = useSettingsStore();
  const [editMode, { toggle: toggleEditMode, close: closeEditMode }] =
    useDisclosure();

  useEffect(() => {
    closeEditMode();
  }, [activeRegion, activeSubregion, closeEditMode]);

  // console.log(activeSubregion.resources);
  // console.log(resourceValues);

  if (isSubregion)
    /* SUBREGION VIEW */
    return (
      <div>
        <Group>
          <Title order={2} className={styles.regionHeader}>
            {activeRegion.name} / {activeSubregion.name}
          </Title>
          <Button onClick={() => toggleEditMode()}>
            {editMode ? 'Finish' : 'Edit'}
          </Button>
        </Group>

        <Grid>
          {activeSubregion.resources.map((resource) => {
            return (
              <Grid.Col span={3} key={resource.id}>
                <Image
                  className={styles.resourceImage}
                  src={`./${resource.name}.png`}
                  alt={`Icon of ${resource.name}`}
                />
                <Title order={4} className={styles.resourceName}>
                  {resource.name}
                </Title>

                <Group gap={'0.2em'}>
                  <IconMapPin stroke={1.2} />
                  <Text>{resource.location}</Text>
                </Group>

                <Group>
                  {editMode && (
                    <NumberInput
                      value={resourceValues[resource.id] ?? 0}
                      onChange={(val: number | string | null) =>
                        setResource(resource.id, val === null ? 0 : Number(val))
                      }
                      min={0}
                      max={regrowLimit}
                    />
                  )}
                  <Text component='span'>
                    {resourceValues[resource.id]} / {regrowLimit}
                  </Text>
                </Group>
                <Button
                  onClick={() => {
                    setResource(resource.id, 0);
                  }}
                >
                  Clear
                </Button>
              </Grid.Col>
            );
          })}
        </Grid>
      </div>
    );
  else
    /* REGION VIEW */
    return (
      <div>
        <Title order={2} className={styles.regionHeader}>
          {activeRegion.name}
        </Title>
        <Grid>
          {activeRegion.subregions.map((subregion) => {
            const resourceStats: Record<
              string,
              { count: number; total: number }
            > = {};

            const resourcesFull: Set<string> = new Set();

            subregion.resources.forEach((resource) => {
              if (resourceValues[resource.id] === regrowLimit) {
                resourcesFull.add(resource.name);
              }

              if (!resourceStats[resource.name]) {
                resourceStats[resource.name] = {
                  count: 0,
                  total: 0,
                };
              }

              resourceStats[resource.name].count += resourceValues[resource.id];
              resourceStats[resource.name].total += 1;
            });

            return (
              <Grid.Col span={4} key={subregion.id}>
                <Group>
                  <Title order={3}>{subregion.name}</Title>
                  {resourcesFull.size > 0 && <IconAlertTriangleFilled />}
                </Group>

                {Object.entries(resourceStats).map(
                  ([name, { count, total }]) => {
                    return (
                      <Group key={name}>
                        <Image
                          className={styles.resourceImage}
                          src={`./${name}.png`}
                        />
                        <Stack gap={0}>
                          <Group>
                            <Title order={4} className={styles.resourceName}>
                              {name}
                            </Title>
                            {resourcesFull.has(name) && (
                              <IconAlertTriangleFilled />
                            )}
                          </Group>

                          <Text>
                            {count} / {total * regrowLimit}
                          </Text>
                        </Stack>
                      </Group>
                    );
                  },
                )}
              </Grid.Col>
            );
          })}
        </Grid>
      </div>
    );
}
