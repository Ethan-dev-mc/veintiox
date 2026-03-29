'use client'

import { useEffect, useState } from 'react'

interface TimeLeft {
  hours: number
  minutes: number
  seconds: number
}

function getTimeLeft(targetDate: Date): TimeLeft {
  const diff = targetDate.getTime() - Date.now()
  if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 }
  return {
    hours: Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export default function CountdownTimer({ hours = 24 }: { hours?: number }) {
  const [target] = useState(() => {
    const d = new Date()
    d.setHours(d.getHours() + hours)
    return d
  })
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft(target))

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeLeft(target)), 1000)
    return () => clearInterval(interval)
  }, [target])

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className="flex items-center gap-3">
      {[
        { label: 'HRS', value: timeLeft.hours },
        { label: 'MIN', value: timeLeft.minutes },
        { label: 'SEG', value: timeLeft.seconds },
      ].map(({ label, value }, i) => (
        <div key={label} className="flex items-center gap-3">
          <div className="text-center">
            <div className="bg-phantom-black border border-phantom-silver rounded-lg px-3 py-2 min-w-[3rem]">
              <span className="text-2xl font-display text-phantom-accent tabular-nums">{pad(value)}</span>
            </div>
            <span className="text-[10px] text-phantom-muted tracking-widest uppercase mt-1 block">{label}</span>
          </div>
          {i < 2 && <span className="text-phantom-accent text-xl font-bold mb-4">:</span>}
        </div>
      ))}
    </div>
  )
}
