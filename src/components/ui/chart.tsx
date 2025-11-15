import * as React from 'react'
import type { TooltipProps } from 'recharts'
import { Tooltip as RechartsTooltip } from 'recharts'

import { cn } from '@/lib/utils'

export type ChartConfig = Record<
  string,
  {
    label: string
    color: string
  }
>

type ChartContainerProps = {
  config: ChartConfig
  className?: string
  children: React.ReactNode
}

export function ChartContainer({ config, className, children }: ChartContainerProps) {
  const style: React.CSSProperties = {}
  for (const key of Object.keys(config)) {
    const color = config[key]?.color
    if (color) {
      ;(style as any)[`--color-${key}`] = color
    }
  }
  return (
    <div className={cn('w-full', className)} style={style}>
      {children}
    </div>
  )
}

type ChartTooltipProps = TooltipProps<number, string>

export function ChartTooltip(props: ChartTooltipProps) {
  return <RechartsTooltip {...props} />
}

type ChartTooltipContentProps = {
  active?: boolean
  payload?: any[]
  label?: string
  indicator?: 'line' | 'dot' | 'none'
}

export function ChartTooltipContent({ active, payload, label }: ChartTooltipContentProps) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className="rounded-md border bg-background px-2 py-1 text-xs shadow-sm">
      {label ? <div className="mb-1 font-medium">{label}</div> : null}
      {payload.map((item) => (
        <div key={item.dataKey} className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground">{item.name ?? item.dataKey}</span>
          <span className="font-mono">{item.value}</span>
        </div>
      ))}
    </div>
  )
}

