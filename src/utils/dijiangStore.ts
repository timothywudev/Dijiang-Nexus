import { create } from "zustand";
import type { Region, Subregion } from '../types'
import { regionsArray } from './regionLoader';

type DijiangStore = {
    activeRegion: Region;
    activeSubregion: Subregion;
    isSubregion: boolean;
    setRegion: (region: Region) => void;
    setSubregion: (region: Region, subregion: Subregion) => void;
};

export const useDijiang = create<DijiangStore>((set) => ({
    activeRegion: regionsArray[0],
    activeSubregion: regionsArray[0].subregions[0],
    isSubregion: false,
    setRegion: (region) => set({ activeRegion: region, isSubregion: false }),
    setSubregion: (region, subregion) => set({ activeRegion: region, activeSubregion: subregion, isSubregion: true }),
}));
