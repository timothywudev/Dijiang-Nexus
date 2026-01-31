import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { useResourceStore } from './playerStore'

dayjs.extend(utc)

function getNextReset()
{
    const now = dayjs().utc()
    const today9AM = now.hour(9).minute(0).second(0).millisecond(0)

    return now.isBefore(today9AM) ? today9AM : today9AM.add(1, 'day')
}

// Used for Countdown Timer
export function getTimeUntilNext9AMUTC()
{
    const now = dayjs().utc()
    const next9 = getNextReset()
    const diff = next9.diff(now)

    return {
        totalMs: diff,
        hours: Math.floor(diff / 3_600_000),
        minutes: Math.floor((diff % 3_600_000) / 60_000),
        seconds: Math.floor((diff % 60_000) / 1_000),
    }
}

function scheduleNextReset()
{
    const next9AM = getNextReset()
    const msUntil = next9AM.diff(dayjs().utc())

    setTimeout(() =>
    {
        useResourceStore.getState().calculateDailyResources()

        scheduleNextReset()
    }, msUntil)
}


// Updates resources and schedules next update
export function startResourceTimer()
{
    useResourceStore.getState().calculateDailyResources()
    scheduleNextReset()
}
