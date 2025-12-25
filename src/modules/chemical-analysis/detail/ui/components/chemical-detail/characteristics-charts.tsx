import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/UIKit/shadcn/ui/card'
import { CharacteristicsHistoryResponse } from '../../../entities/types'
import { useCharacteristicsCharts } from '../../../presenters/useCharacteristicsCharts'
import { useTranslation } from 'react-i18next'

interface CharacteristicsChartsProps {
  data: CharacteristicsHistoryResponse
  range: 'day' | 'month' | 'year'
}

export const CharacteristicsCharts: React.FC<CharacteristicsChartsProps> = ({ data, range }) => {
  const { t } = useTranslation('analysis')

  const { chartData, formatXAxis, formatTooltipValue, formatYAxisTick, hasData } = useCharacteristicsCharts({ data, range })

  if (!hasData) {
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
      {chartData.map(chart => (
        <ChartCard key={chart.key} chart={chart} data={data.data} formatXAxis={formatXAxis} formatTooltipValue={formatTooltipValue} formatYAxisTick={formatYAxisTick} />
      ))}
    </div>
  )
}

interface ChartCardProps {
  chart: any
  data: any[]
  formatXAxis: (value: string) => string
  formatTooltipValue: (value: number, unit: string) => string
  formatYAxisTick: (value: number, unit: string) => string
}

const ChartCard: React.FC<ChartCardProps> = ({ chart, data, formatXAxis, formatTooltipValue, formatYAxisTick }) => (
  <Card className="!p-0 bg-input/40">
    <CardHeader className="border-b-0">
      <CardTitle>
        {chart.name} {chart.unit !== 'pH' && `(${chart.unit})`}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <ChartContent chart={chart} data={data} formatXAxis={formatXAxis} formatTooltipValue={formatTooltipValue} formatYAxisTick={formatYAxisTick} />
      <ChartInfo chart={chart} />
    </CardContent>
  </Card>
)

const ChartContent: React.FC<ChartCardProps> = ({ chart, data, formatXAxis, formatTooltipValue, formatYAxisTick }) => {
  const { t } = useTranslation('analysis')

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 15, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />

          <XAxis dataKey="timestamp" tickFormatter={formatXAxis} stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11, dy: 5 }} axisLine={{ stroke: '#475569' }} />

          <YAxis
            domain={chart.domain}
            stroke="#64748b"
            tick={{ fill: '#94a3b8', fontSize: 11, dx: -8 }}
            axisLine={{ stroke: '#475569' }}
            width={55}
            tickFormatter={value => formatYAxisTick(value, chart.unit)}
          />

          <Tooltip
            formatter={value => [`${formatTooltipValue(value as number, chart.unit)}`, t('indicator')]}
            labelFormatter={formatXAxis}
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
            dataKey={chart.key}
            stroke={chart.color}
            strokeWidth={2.5}
            strokeLinecap="round"
            dot={{
              r: 4,
              fill: '#1e293b',
              stroke: chart.color,
              strokeWidth: 2,
            }}
            activeDot={{
              r: 7,
              fill: '#1e293b',
              stroke: chart.color,
              strokeWidth: 2,
              style: { filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' },
            }}
            name={`${chart.name} (${chart.unit})`}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

const ChartInfo: React.FC<{ chart: any }> = ({ chart }) => {
  const { t } = useTranslation('analysis')

  if (chart.values.length <= 1 || chart.minValue === chart.maxValue) {
    return null
  }

  return (
    <div className="mt-4 text-sm text-gray-500">
      <div className="flex justify-between">
        <span>
          {t('min')}: {chart.minValue.toFixed(2)} {chart.unit}
        </span>
        <span>
          {t('max')}: {chart.maxValue.toFixed(2)} {chart.unit}
        </span>
        <span>
          Δ: {(chart.maxValue - chart.minValue).toFixed(2)} {chart.unit}
        </span>
      </div>
    </div>
  )
}
