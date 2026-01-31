import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { regionsArray } from './regionLoader'

const buildInitialValues = () => Object.fromEntries(
    regionsArray.flatMap((region) =>
        region.subregions.flatMap((subregion) =>
            subregion.resources.map((resource) => [resource.id, 8])
        )
    )
)


type ResourceStore = {
    resourceValues: Record<number, number>;
    setResource: (id: number, value: number) => void;
    incrementResource: (id: number, amount?: number) => void;
    resetResource: (id: number) => void;
};

export const useResourceStore = create<ResourceStore>()(
    persist(
        (set) => ({
            resourceValues: buildInitialValues(),
            setResource: (id: number, value: number) =>
                set((state) => ({
                    resourceValues: {
                        ...state.resourceValues,
                        [id]: value,
                    },
                })),
            incrementResource: (id, amount = 1) =>
                set((state) => ({
                    resourceValues: {
                        ...state.resourceValues,
                        [id]: (state.resourceValues[id] ?? 0) + amount,
                    },
                })),
            resetResource: (id) =>
                set((state) => ({
                    resourceValues: {
                        ...state.resourceValues,
                        [id]: 0,
                    },
                })),
        }),
        {
            name: 'player-resources',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);

type SettingsStore = {
    level: number,
    regrowRate: number,
    regrowLimit: number,
    setLevel: (level: number) => void,
}

export const useSettingsStore = create<SettingsStore>((set) => ({
    level: 7,
    regrowRate: 2,
    regrowLimit: 8,
    setLevel: (level) => set({
        level,
        regrowRate: level < 5 ? 2 : 1,
        regrowLimit: level > 5 ? 8 : level > 2 ? 6 : 1
    }),
}));