import { Link } from 'react-router-dom';
import {
  BackgroundImage,
  Flex,
  Group,
  Overlay,
  Title,
  Image,
  Text,
  SimpleGrid,
} from '@mantine/core';
import { regionsArray } from '../utils/regionLoader';
import { useResourceStore, useSettingsStore } from '../utils/playerStore';
import {
  IconAlertTriangleFilled,
  IconArrowBarToRight,
} from '@tabler/icons-react';
import styles from './styles/Region.module.css';

function RegionMap() {
  const { resourceValues } = useResourceStore();
  const { regrowLimit } = useSettingsStore();

  return (
    <>
      {regionsArray.map((region) => {
        const resourcesmaps = region.subregions.map((subregion) => {
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
            <div key={subregion.id}>
              <Link
                to={`${region.id}/${subregion.id}`}
                relative='path'
                style={{ textDecoration: 'none' }}
              >
                <Flex
                  justify={'space-between'}
                  align={'center'}
                  className={styles.subregionHeader}
                >
                  <Group>
                    <Title order={3} className={styles.subregionName}>
                      {subregion.name}
                    </Title>
                    {resourcesFull.size > 0 && <IconAlertTriangleFilled />}
                  </Group>
                  <IconArrowBarToRight />
                </Flex>
              </Link>

              <div className={styles.resource}>
                {Object.entries(resourceStats).map(
                  ([name, { count, total }]) => {
                    return (
                      <Group key={name}>
                        <Image
                          className={styles.resourceImage}
                          src={`./${name}.png`}
                        />
                        <Group>
                          <Text>
                            {count} / {total * regrowLimit}{' '}
                          </Text>
                          {resourcesFull.has(name) && (
                            <IconAlertTriangleFilled />
                          )}
                        </Group>
                      </Group>
                    );
                  },
                )}
              </div>
            </div>
          );
        });

        return (
          <BackgroundImage
            key={region.id}
            src={`./pictures/${region.id}.jpg`}
            pos='relative'
          >
            <Overlay
              gradient='linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.85))'
              opacity={1}
              zIndex={1}
            />
            <Flex
              w={'100%'}
              p={'xl'}
              style={{ position: 'relative', zIndex: 2 }}
              direction={'column'}
            >
              <Title>{region.name}</Title>
              <Group>
                <SimpleGrid
                  cols={3}
                  p={'md'}
                  verticalSpacing={'xl'}
                  w={'75%'}
                  className={styles.resourceGrid}
                >
                  {resourcesmaps}
                </SimpleGrid>
              </Group>
            </Flex>
          </BackgroundImage>
        );
      })}
    </>
  );
}

export default function Region() {
  return (
    <Flex direction={'column'} w={'100%'}>
      <RegionMap />
    </Flex>
  );
}
