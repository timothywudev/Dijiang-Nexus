import { useParams, useNavigate } from 'react-router-dom';

import {
  BackgroundImage,
  Flex,
  Group,
  Overlay,
  Title,
  Image,
  Text,
  SimpleGrid,
  Button,
  UnstyledButton,
  NumberInput,
} from '@mantine/core';
import { regionsById } from '../utils/regionLoader';
import { useResourceStore, useSettingsStore } from '../utils/playerStore';
import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconEdit,
  IconMapPin,
} from '@tabler/icons-react';
import styles from './styles/Subregion.module.css';
import type { Region } from '../types';
import { useState } from 'react';

const baseUrl = import.meta.env.BASE_URL;

type Params = {
  region: string;
  subregion: string;
};

function getSubregionById(regions: Region, subregionId: string) {
  return regions.subregions.find((region) => region.id === subregionId);
}

function getNextSubregion(region: Region, subregionId: string) {
  const index = region.subregions.findIndex((sub) => sub.id === subregionId);
  if (index === -1 || index === region.subregions.length - 1) {
    return undefined;
  }
  return region.subregions[index + 1];
}

function getPrevSubregion(region: Region, subregionId: string) {
  const index = region.subregions.findIndex((sub) => sub.id === subregionId);
  if (index <= 0) {
    return undefined;
  }
  return region.subregions[index - 1];
}

function ResourcesMap({ editMode }: Readonly<{ editMode: boolean }>) {
  const { region, subregion } = useParams() as Params;
  const { resourceValues, setResource } = useResourceStore();
  const { regrowLimit } = useSettingsStore();

  const subRegion = getSubregionById(regionsById[region], subregion);

  if (!subRegion) return <div>Subregion not found</div>;

  return subRegion.resources.map((resource) => {
    return (
      <div key={resource.id}>
        <Image
          className={styles.resourceImage}
          src={`${baseUrl}/${resource.name}.png`}
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
          {editMode ? (
            <NumberInput
              min={0}
              max={regrowLimit}
              value={resourceValues[resource.id]}
              onChange={(val) => {
                if (val === null || val === undefined) {
                  setResource(resource.id, 0);
                } else {
                  setResource(resource.id, Number(val));
                }
              }}
              style={{ width: 80 }}
            />
          ) : (
            <Text>
              {resourceValues[resource.id]} / {regrowLimit}
            </Text>
          )}
        </Group>
        <Button
          onClick={() => {
            setResource(resource.id, 0);
          }}
        >
          Clear
        </Button>
      </div>
    );
  });
}

export default function Subregion() {
  const { region, subregion } = useParams() as Params;
  const regionName = regionsById[region].name;
  const subregionName = getSubregionById(regionsById[region], subregion)?.name;
  const nextSubregion = getNextSubregion(regionsById[region], subregion);
  const prevSubregion = getPrevSubregion(regionsById[region], subregion);
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const toggleEditMode = () => setEditMode((prev) => !prev);

  return (
    <Flex direction={'column'} w={'100%'} h={'100%'}>
      <BackgroundImage
        src={`${baseUrl}/pictures/${region}.jpg`}
        pos='relative'
        style={{
          borderBottom: '1px solid var(--mantine-color-endfield-yellow-1',
        }}
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
          <Title>
            {regionName}
            {subregionName ? ` / ${subregionName}` : ''}
          </Title>
        </Flex>
      </BackgroundImage>
      <Flex direction='column' className={styles.resourceGridBG}>
        <Flex px={'xl'} justify={'space-between'} align={'center'}>
          <UnstyledButton
            onClick={() => toggleEditMode()}
            className={styles.subregionEditButton}
          >
            <IconEdit />
            {editMode ? 'Finish' : 'Edit'}
          </UnstyledButton>

          <Group>
            <UnstyledButton
              onClick={() =>
                prevSubregion &&
                navigate(`/regions/${region}/${prevSubregion.id}`)
              }
              disabled={!prevSubregion}
              className={styles.subregionNavButton}
              style={{ visibility: prevSubregion ? 'visible' : 'hidden' }}
            >
              {prevSubregion && (
                <>
                  <IconArrowNarrowLeft />
                  <Text component='span' truncate='end'>
                    {prevSubregion.name}
                  </Text>
                </>
              )}
            </UnstyledButton>
            <UnstyledButton
              onClick={() =>
                nextSubregion &&
                navigate(`/regions/${region}/${nextSubregion.id}`)
              }
              disabled={!nextSubregion}
              className={styles.subregionNavButton}
              style={{ visibility: nextSubregion ? 'visible' : 'hidden' }}
            >
              {nextSubregion && (
                <>
                  <Text component='span' truncate='end'>
                    {nextSubregion.name}
                  </Text>
                  <IconArrowNarrowRight />
                </>
              )}
            </UnstyledButton>
          </Group>
        </Flex>
        <SimpleGrid cols={4} p={'xl'}>
          <ResourcesMap editMode={editMode} />
        </SimpleGrid>
      </Flex>
    </Flex>
  );
}
