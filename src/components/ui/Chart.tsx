import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { chartColors } from '@/design/tokens'

interface BarDatum {
  label: string
  value: number
}

/**
 * Rounded bar chart with a light background "track" bar
 * (assets/components/component-graph.png). Colors come from token module.
 */
export function BarChartCard({
  data,
  max = 200,
  height = 300,
}: {
  data: BarDatum[]
  max?: number
  height?: number
}) {
  const withTrack = data.map((d) => ({ ...d, track: max }))
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={withTrack} barGap={-16} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={chartColors.grid} strokeDasharray="3 3" />
        <XAxis
          dataKey="label"
          tick={{ fill: chartColors.label, fontSize: 12 }}
          axisLine={{ stroke: chartColors.grid }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: chartColors.label, fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          domain={[0, max]}
        />
        <RTooltip
          cursor={{ fill: 'transparent' }}
          contentStyle={{
            borderRadius: 8,
            border: `1px solid ${chartColors.grid}`,
            fontSize: 13,
          }}
        />
        <Bar dataKey="track" fill={chartColors.barTrack} radius={[8, 8, 8, 8]} barSize={16} />
        <Bar dataKey="value" fill={chartColors.bar} radius={[8, 8, 8, 8]} barSize={16} />
      </BarChart>
    </ResponsiveContainer>
  )
}
