import type { Region } from '../types'
const modules = import.meta.glob('../data/regions/*.json', { eager: true });

const regionsArray: Region[] = [];
const regionsByName: Record<string, Region> = {};
const regionsById: Record<number, Region> = {};

for (const path in modules)
{
    const region = (modules[path] as Region);

    regionsArray.push(region);
    regionsByName[region.name] = region;
    regionsById[region.id] = region;
}

export
{
    regionsArray,
    regionsByName,
    regionsById,
};