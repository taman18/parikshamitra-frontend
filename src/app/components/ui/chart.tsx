import type React from "react";

interface ChartProps {
  data: { name: string; value: number }[];
  index: string;
  categories: string[];
  colors: string[];
  valueFormatter: (value: number) => string;
  yAxisWidth?: number;
}


type BarChartProps = {
  data: { label: string; value: number }[];
  height?: number;
  barColor?: string;
};

export const BarChart: React.FC<BarChartProps> = ({
  data,
  height = 300,
  barColor = "#6366f1",
}) => {
  const maxValue = Math.max(...data.map((item) => item.value));
    return (
    <div
      className="w-full bg-white p-4 flex items-end"
      style={{ height, gap: "1rem" }}
    >
      {data.map((item, i) => {
        const barHeight = (item.value / maxValue) * 100;

        return (
          <div key={i} className="flex flex-col items-center w-1/6 h-full">
            <div
              style={{
                height: `${barHeight}%`,
                backgroundColor: barColor,
                width: "100%",
                transition: "height 0.3s",
              }}
            />
            <span className="mt-2 text-xs">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default BarChart;

export const LineChart: React.FC<ChartProps> = ({
  data,
  index,
  categories,
  colors,
  valueFormatter,
  yAxisWidth,
}) => {
  const maxValue = Math.max(...data.map((item) => item.value));

  return (
    <div className="w-full h-full relative">
      {data.map((item, i) => (
        <div
          key={i}
          className="absolute bottom-0"
          style={{
            left: `${(100 / data.length) * i}%`,
            width: `${100 / data.length}%`,
          }}
        >
          <div
            className="bg-green-500"
            style={{
              border: "1px solid black",
              height: `${(item.value / maxValue) * 100}%`,
              backgroundColor: colors[i % colors.length], // Use dynamic color based on index
            }}
          />
          <div className="text-center text-xs">{item.name}</div>
          <div className="text-center text-xs mt-1">{valueFormatter(item.value)}</div> {/* Optional value display */}
        </div>
      ))}
    </div>
  );
};
