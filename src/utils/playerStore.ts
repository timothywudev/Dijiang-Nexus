import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { regionsArray } from './regionLoader'

dayjs.extend(utc)

const buildInitialValues = () => Object.fromEntries(
    regionsArray.flatMap((region) =>
        region.subregions.flatMap((subregion) =>
            subregion.resources.map((resource) => [resource.id, 8])
        )
    )
)

type ResourceStore = {
    resourceValues: Record<string, number>;
    setResource: (id: string, value: number) => void;
    incrementResource: (id: string, amount?: number) => void;
    resetResource: (id: string) => void;
    verifyLimits: () => void;
    lastUpdate: string;
    calculateDailyResources: () => void;
};

export const useResourceStore = create<ResourceStore>()(
    persist(
        (set, get) => ({
            resourceValues: buildInitialValues(),
            setResource: (id, value) =>
                set((state) => ({
                    resourceValues: {
                        ...state.resourceValues,
                        [id]: value,
                    },
                    lastUpdate: dayjs().utc().toISOString(),
                })),
            incrementResource: (id, amount = 1) =>
                set((state) => ({
                    resourceValues: {
                        ...state.resourceValues,
                        [id]: (state.resourceValues[id] ?? 0) + amount,
                    },
                    lastUpdate: dayjs().utc().toISOString(),
                })),
            resetResource: (id) =>
                set((state) => ({
                    resourceValues: {
                        ...state.resourceValues,
                        [id]: 0,
                    },
                    lastUpdate: dayjs().utc().toISOString(),
                })),

            //Check and set over-capped resources to limit
            verifyLimits: () =>
            {
                const { regrowLimit } = useSettingsStore.getState()
                set((state) => ({
                    resourceValues: Object.fromEntries(
                        Object.entries(state.resourceValues).map(([id, value]) => [
                            id,
                            Math.min(value, regrowLimit),
                        ])
                    ),
                }))
            },
            lastUpdate: dayjs.utc().toISOString(),

            // Check lastUpdate for last time since Dijiang Nexus was accessed
            calculateDailyResources()
            {
                const lastUpdate = dayjs(get().lastUpdate).utc();
                const now = dayjs.utc();

                let next9AM = lastUpdate.hour() < 9
                    ? lastUpdate.hour(9).minute(0).second(0).millisecond(0)
                    : lastUpdate.add(1, 'day').hour(9).minute(0).second(0).millisecond(0);

                let resourceValues = { ...get().resourceValues };
                const { regrowRate, regrowLimit } = useSettingsStore.getState();

                // Update Resources
                while (next9AM.isBefore(now) || next9AM.isSame(now))
                {
                    resourceValues = Object.fromEntries(
                        Object.entries(resourceValues).map(([id, value]) => [
                            id,
                            Math.min(value + regrowRate, regrowLimit),
                        ])
                    );

                    next9AM = next9AM.add(1, 'day');
                }

                set(() => ({
                    resourceValues,
                    lastUpdate: dayjs().utc().toISOString(),
                }));
            }

        }),
        {
            name: 'player-resources',
            storage: createJSONStorage(() => localStorage),
            version: 0,
            migrate: (persistedState: unknown) =>
            {
                const persisted = persistedState as { resourceValues: Record<string, number>; lastUpdate?: string; }
                const initialValues = buildInitialValues()
                return {
                    resourceValues: {
                        ...initialValues,
                        ...persisted?.resourceValues,
                    },
                    lastUpdate: persisted?.lastUpdate ?? dayjs().utc().toISOString(),
                }
            },
        }
    )
);

type SettingsStore = {
    level: number,
    regrowRate: number,
    regrowLimit: number,
    setLevel: (level: number) => void,
}

export const useSettingsStore = create<SettingsStore>()(
    persist(
        (set) => ({
            level: 7,
            regrowRate: 2,
            regrowLimit: 8,
            setLevel: (level) =>
            {
                set({
                    level,
                    regrowRate: level > 5 ? 2 : 1,
                    regrowLimit: level > 5 ? 8 : level > 2 ? 6 : 4,
                })
                useResourceStore.getState().verifyLimits()
            },
        }),
        {
            name: 'player-settings',
            storage: createJSONStorage(() => localStorage),
        }
    )
)