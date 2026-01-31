import { Grid, NumberInput, Text } from '@mantine/core';
import { useDijiang } from '../utils/dijiangStore';
import { useResourceStore, useSettingsStore } from '../utils/playerStore';
import { useEffect } from 'react';

import styles from './styles/Content.module.css';
import { IconMapPin } from '@tabler/icons-react';

export default function Main() {
  const { activeRegion, activeSubregion, isSubregion } = useDijiang();
  const { resourceValues, setResource } = useResourceStore();
  const { regrowLimit } = useSettingsStore();

  useEffect(() => {
    console.log(resourceValues[0]);
  }, [resourceValues]);

  console.log(activeSubregion.resources);
  console.log(resourceValues);

  if (isSubregion)
    /* SUBREGION VIEW */
    return (
      <div>
        <h2 className={styles.regionHeader}>
          {activeRegion.name} / {activeSubregion.name}
        </h2>
        <Grid>
          {activeSubregion.resources.map((resource) => {
            return (
              <Grid.Col span={3} key={resource.id}>
                <h4>{resource.name}</h4>
                <Text>
                  <IconMapPin />
                  {resource.location}
                </Text>
                <h4>
                  <NumberInput
                    value={resourceValues[resource.id] ?? 0}
                    onChange={(val: number | string | null) =>
                      setResource(resource.id, val === null ? 0 : Number(val))
                    }
                    min={0}
                    max={regrowLimit}
                  />{' '}
                  / {regrowLimit}
                </h4>
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
        <h2 className={styles.regionHeader}>{activeRegion.name}</h2>
        <Grid>
          {activeRegion.subregions.map((subregion) => {
            const resourceStats: Record<
              string,
              { count: number; total: number }
            > = {};

            subregion.resources.forEach((resource) => {
              if (!resourceStats[resource.name]) {
                resourceStats[resource.name] = {
                  count: 0,
                  total: 0,
                };
              }

              resourceStats[resource.name].count += 1;
              resourceStats[resource.name].total += resourceValues[resource.id];
            });

            return (
              <Grid.Col span={4} key={subregion.id}>
                <h3>{subregion.name}</h3>

                {Object.entries(resourceStats).map(
                  ([name, { count, total }]) => {
                    return (
                      <div key={name}>
                        <h4>{name}</h4>
                        <h4>Count: {count}</h4>
                        <h4>Total: {total}</h4>
                      </div>
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
