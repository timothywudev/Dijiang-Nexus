import { useEffect, useState } from 'react'
import { getTimeUntilNext9AMUTC } from './resetTimer'

export function CountdownTimer()
{
    const [time, setTime] = useState(getTimeUntilNext9AMUTC())

    useEffect(() =>
    {
        const interval = setInterval(() =>
        {
            setTime(getTimeUntilNext9AMUTC())
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    return time
}
