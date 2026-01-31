import GUI from 'lil-gui'
import { useDijiang } from './dijiangStore'

export function initDebugGui()
{
    if (!import.meta.env.DEV) return

    const gui = new GUI({ title: 'Dijiang Store' })

    const debug = {
        activeRegion: '',
        activeSubregion: '',
        isSubregion: false,
    }

    gui.add(debug, 'activeRegion').listen()
    gui.add(debug, 'activeSubregion').listen()
    gui.add(debug, 'isSubregion').listen()
    gui.add(
        { clearStorage: () => sessionStorage.clear() },
        'clearStorage'
    ).name('Erase Session Storage');

    const sync = () =>
    {
        const state = useDijiang.getState()

        debug.activeRegion = state.activeRegion?.name ?? 'none'
        debug.activeSubregion = state.activeSubregion?.name ?? 'none'
        debug.isSubregion = state.isSubregion
    }

    sync()

    useDijiang.subscribe(sync)
}
