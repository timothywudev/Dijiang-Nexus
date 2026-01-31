import { Anchor } from '@mantine/core';
import styles from './styles/Navbar.module.css';
import { regionsArray } from '../utils/regionLoader';
import { useDijiang } from '../utils/dijiangStore';

export default function Navbar() {
  const { setRegion, setSubregion } = useDijiang();

  return (
    <div className={styles.navbar}>
      <ul>
        {regionsArray.map((region) => (
          <li key={region.id}>
            <Anchor onClick={() => setRegion(region)}>{region.name}</Anchor>
            <ul>
              {region.subregions.map((subregion) => {
                return (
                  <li key={subregion.id}>
                    <Anchor onClick={() => setSubregion(region, subregion)}>
                      {subregion.name}
                    </Anchor>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
