import GUI from 'lil-gui'
import { useDijiang } from './dijiangStore'
import { useResourceStore, useSettingsStore } from './playerStore'

export function initDebugGui()
{
    if (!import.meta.env.DEV) return

    const gui = new GUI({ title: 'Dijiang Store' })

    const debug = {
        activeRegion: '',
        activeSubregion: '',
        isSubregion: false,
        explorationLevel: 0,
        timestamp: '',
    }

    gui.add(debug, 'activeRegion').listen()
    gui.add(debug, 'activeSubregion').listen()
    gui.add(debug, 'isSubregion').listen()
    gui.add(debug, 'explorationLevel').listen()
    gui.add(debug, 'timestamp').listen()
    gui.add(
        { clearStorage: () => localStorage.clear() },
        'clearStorage'
    ).name('Erase Local Storage');

    const sync = () =>
    {
        const state = useDijiang.getState()
        const resources = useResourceStore.getState();
        const settings = useSettingsStore.getState();

        debug.activeRegion = state.activeRegion?.name ?? 'none'
        debug.activeSubregion = state.activeSubregion?.name ?? 'none'
        debug.isSubregion = state.isSubregion
        debug.explorationLevel = settings.level
        debug.timestamp = resources.lastUpdate
    }

    sync()

    useSettingsStore.subscribe(sync)
    useDijiang.subscribe(sync)
    useResourceStore.subscribe(sync)
}
