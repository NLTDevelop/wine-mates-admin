import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/UIKit/shadcn/ui/card'
import { useTranslation } from 'react-i18next'
import { ICharts, ChartGraph } from '../../../entities/chemical_types'
import { useCharacteristicsCharts } from '../../../presenters/useCharacteristicsCharts'

interface CharacteristicsChartsProps {
  charts: ICharts
}

export const CharacteristicsCharts = ({ charts }: CharacteristicsChartsProps) => {
  const { t } = useTranslation('analysis')
  const { formatXAxis, formatTooltipValue, formatYAxisTick } = useCharacteristicsCharts()

  if (!charts?.graphs || charts?.graphs.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-gray-500">{t('no_data')}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
      {charts?.graphs.map(graph => (
        <ChartCard key={graph.parameter} graph={graph} periodType={charts.period.type} formatXAxis={formatXAxis} formatTooltipValue={formatTooltipValue} formatYAxisTick={formatYAxisTick} />
      ))}
    </div>
  )
}

interface ChartCardProps {
  graph: ChartGraph
  periodType: 'day' | 'month' | 'year'
  formatXAxis: (value: string, periodType: 'day' | 'month' | 'year') => string
  formatTooltipValue: (value: number, unit: string) => string
  formatYAxisTick: (value: number, unit: string) => string
}

const ChartCard: React.FC<ChartCardProps> = ({ graph, periodType, formatXAxis, formatTooltipValue, formatYAxisTick }) => {
  const { t } = useTranslation('analysis')

  const chartData = graph.data.map(item => ({
    timestamp: item.date,
    value: item.value,
    label: item.label,
  }))

  const getChartColor = (parameter: string): string => {
    const colors: Record<string, string> = {
      sugarContent: '#3b82f6',
      alcohol: '#ef4444',
      ph: '#10b981',
      volatileAcidity: '#f59e0b',
      totalAcidity: '#8b5cf6',
    }
    return colors[parameter] || '#6b7280'
  }

  const chartColor = getChartColor(graph.parameter)

  return (
    <Card className="!p-0 bg-input/40">
      <CardHeader className="border-b-0">
        <CardTitle>
          {graph.title} {graph.unit !== 'pH' && graph.unit !== 'рН' && `(${graph.unit})`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 5, right: 15, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />

              <XAxis dataKey="timestamp" tickFormatter={value => formatXAxis(value, periodType)} stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11, dy: 5 }} axisLine={{ stroke: '#475569' }} />

              <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11, dx: -8 }} axisLine={{ stroke: '#475569' }} width={55} tickFormatter={value => formatYAxisTick(value, graph.unit)} />

              <Tooltip
                formatter={value => [`${formatTooltipValue(value as number, graph.unit)}`, t('indicator')]}
                labelFormatter={label => formatXAxis(label, periodType)}
                contentStyle={{
                  backgroundColor: '#2e2e38',
                  border: '1px solid #2e2e38',
                  borderRadius: '3px',
                  padding: '4px',
                }}
                itemStyle={{
                  color: '#e2e8f0',
                  fontSize: '13px',
                  padding: '2px 0',
                }}
                labelStyle={{
                  color: '#cbd5e1',
                  fontWeight: 500,
                  fontSize: '12px',
                  marginBottom: '2px',
                }}
              />

              <Line
                type="monotone"
                dataKey="value"
                stroke={chartColor}
                strokeWidth={2.5}
                strokeLinecap="round"
                dot={{
                  r: 4,
                  fill: '#1e293b',
                  stroke: chartColor,
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 7,
                  fill: '#1e293b',
                  stroke: chartColor,
                  strokeWidth: 2,
                  style: { filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' },
                }}
                name={`${graph.title} (${graph.unit})`}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <ChartInfo stats={graph.stats} unit={graph.unit} />
      </CardContent>
    </Card>
  )
}

interface ChartInfoProps {
  stats: {
    min: number
    max: number
    delta: number
    current: number
  }
  unit: string
}

const ChartInfo: React.FC<ChartInfoProps> = ({ stats, unit }) => {
  const { t } = useTranslation('analysis')

  if (stats.delta === 0) {
    return null
  }

  return (
    <div className="mt-4 text-sm text-gray-500">
      <div className="flex justify-between">
        <span>
          {t('min')}: {stats.min.toFixed(2)} {unit}
        </span>
        <span>
          {t('max')}: {stats.max.toFixed(2)} {unit}
        </span>
        <span>
          Δ: {stats.delta.toFixed(2)} {unit}
        </span>
      </div>
    </div>
  )
}
