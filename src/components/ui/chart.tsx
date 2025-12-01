import * as React from 'react'
import type { LegendProps, TooltipProps } from 'recharts'
import { Legend as RechartsLegend, Tooltip as RechartsTooltip } from 'recharts'

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
  labelFormatter?: (label: string | number) => React.ReactNode
  valueFormatter?: (value: number | string, name?: string) => React.ReactNode
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  indicator = 'none',
  labelFormatter,
  valueFormatter,
}: ChartTooltipContentProps) {
  if (!active || !payload || payload.length === 0) return null

  const formattedLabel = labelFormatter ? labelFormatter(label ?? '') : label

  return (
    <div className="rounded-md border bg-background px-2 py-1 text-xs shadow-sm">
      {formattedLabel ? <div className="mb-1 font-medium">{formattedLabel}</div> : null}
      {payload.map((item) => {
        const indicatorColor = item.color || item.payload?.fill || item.stroke || 'currentColor'
        const value = valueFormatter ? valueFormatter(item.value, item.name ?? item.dataKey) : item.value
        const name = item.name ?? item.dataKey
        return (
          <div key={item.dataKey} className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-muted-foreground">
              {indicator === 'dot' ? (
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: indicatorColor }} />
              ) : indicator === 'line' ? (
                <span className="inline-block h-px w-3" style={{ backgroundColor: indicatorColor }} />
              ) : null}
              {name}
            </span>
            <span className="font-mono">{value}</span>
          </div>
        )
      })}
    </div>
  )
}

export function ChartLegend(props: LegendProps) {
  return <RechartsLegend {...props} />
}

export function ChartLegendContent(props: LegendProps) {
  const { payload } = props
  if (!payload || payload.length === 0) return null

  return (
    <div className="flex flex-wrap gap-3 text-xs">
      {payload.map((entry) => (
        <div key={entry.value} className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-muted-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}
