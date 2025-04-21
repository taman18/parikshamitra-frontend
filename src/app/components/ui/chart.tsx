import type React from "react"

interface ChartProps {
  data: { name: string; value: number }[]
  index: string
  categories: string[]
  colors: string[]
  valueFormatter?: (value: number) => string
  yAxisWidth?: number
}

export const BarChart: React.FC<ChartProps> = ({ data, index, categories, colors, valueFormatter, yAxisWidth }) => {
  const maxValue = Math.max(...data.map((item) => item.value))

  return (
    <div className="w-full h-full relative">
      {data.map((item, i) => (
        <div
          key={i}
          className="absolute bottom-0"
          style={{ left: `${(100 / data.length) * i}%`, width: `${100 / data.length}%` }}
        >
          <div
            className="bg-primary"
            style={{
              height: `${(item.value / maxValue) * 100}%`,
              backgroundColor: colors[0],
            }}
          ></div>
          <div className="text-center text-xs">{item.name}</div>
        </div>
      ))}
    </div>
  )
}

export const LineChart: React.FC<ChartProps> = ({ data, index, categories, colors, valueFormatter, yAxisWidth }) => {
  const maxValue = Math.max(...data.map((item) => item.value))

  return (
    <div className="w-full h-full relative">
      {data.map((item, i) => (
        <div
          key={i}
          className="absolute bottom-0"
          style={{ left: `${(100 / data.length) * i}%`, width: `${100 / data.length}%` }}
        >
          <div
            className="bg-green-500"
            style={{
              height: `${(item.value / maxValue) * 100}%`,
              backgroundColor: colors[0],
            }}
          ></div>
          <div className="text-center text-xs">{item.name}</div>
        </div>
      ))}
    </div>
  )
}
