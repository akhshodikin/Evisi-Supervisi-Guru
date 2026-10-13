import React, { useState } from 'react';

interface BarChartProps {
  data: { label: string; value: number; color?: string; teacherName: string; subject: string }[];
}

export const TeacherScoreBarChart: React.FC<BarChartProps> = ({ data }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return <div className="h-64 flex items-center justify-center text-xs text-slate-400">Belum ada data nilai observasi</div>;
  }

  const chartHeight = 220;
  const chartWidth = 560;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 45;

  const innerWidth = chartWidth - paddingLeft - paddingRight;
  const innerHeight = chartHeight - paddingTop - paddingBottom;

  const barWidth = Math.min(45, Math.max(22, (innerWidth / data.length) - 16));
  const spacing = (innerWidth - barWidth * data.length) / (data.length + 1);

  // Reference lines: 0, 70, 80, 90, 100
  const yTicks = [0, 50, 70, 80, 90, 100];

  return (
    <div className="relative w-full h-full flex flex-col justify-center">
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="w-full h-auto overflow-visible select-none"
      >
        {/* Grid lines and Y labels */}
        {yTicks.map((val) => {
          const y = paddingTop + innerHeight - (val / 100) * innerHeight;
          const isStandard = val === 80;
          return (
            <g key={val}>
              <line
                x1={paddingLeft}
                y1={y}
                x2={chartWidth - paddingRight}
                y2={y}
                stroke={isStandard ? '#10b981' : '#e2e8f0'}
                strokeWidth={isStandard ? 1.5 : 1}
                strokeDasharray={isStandard ? '4 3' : undefined}
                opacity={isStandard ? 0.8 : 0.6}
              />
              <text
                x={paddingLeft - 8}
                y={y + 3.5}
                textAnchor="end"
                className={`text-[9px] font-mono ${isStandard ? 'fill-emerald-600 font-bold' : 'fill-slate-400'}`}
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Target 80 badge */}
        <text
          x={chartWidth - paddingRight}
          y={paddingTop + innerHeight - (80 / 100) * innerHeight - 4}
          textAnchor="end"
          className="text-[8px] font-semibold fill-emerald-600 tracking-wide"
        >
          Target Baik (80)
        </text>

        {/* Bars */}
        {data.map((item, idx) => {
          const x = paddingLeft + spacing + idx * (barWidth + spacing);
          const barH = (item.value / 100) * innerHeight;
          const y = paddingTop + innerHeight - barH;
          const isHovered = hoveredIdx === idx;
          const isZero = item.value === 0;

          // Color based on score
          let fill = '#10b981'; // >= 90
          if (item.value >= 80 && item.value < 90) fill = '#0ea5e9';
          else if (item.value >= 70 && item.value < 80) fill = '#f59e0b';
          else if (item.value > 0 && item.value < 70) fill = '#ef4444';
          else if (isZero) fill = '#cbd5e1';

          return (
            <g
              key={idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="cursor-pointer transition-all duration-200"
            >
              {/* Highlight background on hover */}
              {isHovered && (
                <rect
                  x={x - 4}
                  y={paddingTop}
                  width={barWidth + 8}
                  height={innerHeight}
                  fill="#f8fafc"
                  rx={6}
                />
              )}

              {/* The bar */}
              <rect
                x={x}
                y={isZero ? paddingTop + innerHeight - 4 : y}
                width={barWidth}
                height={isZero ? 4 : barH}
                fill={fill}
                rx={5}
                className="transition-all duration-200"
                style={{
                  filter: isHovered ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))' : undefined,
                  transform: isHovered ? 'scaleY(1.02)' : 'scaleY(1)',
                  transformOrigin: `${x + barWidth / 2}px ${paddingTop + innerHeight}px`
                }}
              />

              {/* Value label above bar */}
              <text
                x={x + barWidth / 2}
                y={isZero ? y - 8 : y - 6}
                textAnchor="middle"
                className={`text-[10px] font-bold ${isZero ? 'fill-slate-400' : 'fill-slate-800'}`}
              >
                {item.value > 0 ? item.value : 'N/A'}
              </text>

              {/* Label under bar (Short Name) */}
              <text
                x={x + barWidth / 2}
                y={paddingTop + innerHeight + 16}
                textAnchor="middle"
                className="text-[9.5px] font-medium fill-slate-600 truncate"
              >
                {item.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Floating Tooltip when hovered */}
      {hoveredIdx !== null && data[hoveredIdx] && (
        <div className="absolute top-2 right-4 bg-slate-900 text-white text-[11px] p-2.5 rounded-lg shadow-xl border border-slate-700 pointer-events-none z-10 max-w-xs animate-fade-in">
          <p className="font-bold text-amber-400">{data[hoveredIdx].teacherName}</p>
          <p className="text-slate-300 text-[10px]">{data[hoveredIdx].subject}</p>
          <div className="mt-1 pt-1 border-t border-slate-700 flex justify-between gap-3">
            <span className="text-slate-400">Skor Supervisi:</span>
            <span className="font-bold text-emerald-400">{data[hoveredIdx].value > 0 ? `${data[hoveredIdx].value} / 100` : 'Belum Dinilai'}</span>
          </div>
        </div>
      )}
    </div>
  );
};

interface DonutChartProps {
  categories: {
    label: string;
    count: number;
    color: string;
  }[];
}

export const CategoryDonutChart: React.FC<DonutChartProps> = ({ categories }) => {
  const total = categories.reduce((sum, c) => sum + c.count, 0);

  if (total === 0) {
    return <div className="h-64 flex items-center justify-center text-xs text-slate-400">Belum ada data supervisi</div>;
  }

  // Calculate SVG arc paths
  const size = 180;
  const center = size / 2;
  const radius = 68;
  const innerRadius = 46;

  let currentAngle = -Math.PI / 2; // start from top

  const slices = categories.map((cat) => {
    const fraction = cat.count / total;
    const angle = fraction * 2 * Math.PI;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);

    const ix1 = center + innerRadius * Math.cos(endAngle);
    const iy1 = center + innerRadius * Math.sin(endAngle);
    const ix2 = center + innerRadius * Math.cos(startAngle);
    const iy2 = center + innerRadius * Math.sin(startAngle);

    const largeArc = angle > Math.PI ? 1 : 0;

    const pathData = fraction === 1
      ? `M ${center} ${center - radius} A ${radius} ${radius} 0 1 1 ${center} ${center + radius} A ${radius} ${radius} 0 1 1 ${center} ${center - radius} M ${center} ${center - innerRadius} A ${innerRadius} ${innerRadius} 0 1 0 ${center} ${center + innerRadius} A ${innerRadius} ${innerRadius} 0 1 0 ${center} ${center - innerRadius}`
      : `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix2} ${iy2} Z`;

    const percentage = Math.round(fraction * 100);

    return {
      ...cat,
      percentage,
      pathData
    };
  });

  return (
    <div className="flex flex-col sm:flex-row items-center justify-around gap-4 h-full">
      {/* Donut graphic */}
      <div className="relative w-44 h-44 flex-shrink-0">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full select-none">
          {slices.map((slice, i) => (
            <path
              key={i}
              d={slice.pathData}
              fill={slice.color}
              className="hover:opacity-90 transition-opacity cursor-pointer"
            >
              <title>{`${slice.label}: ${slice.count} (${slice.percentage}%)`}</title>
            </path>
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-xl font-extrabold text-slate-800 leading-none">{total}</span>
          <span className="text-[10px] text-slate-500 font-medium mt-0.5">Guru Terdata</span>
        </div>
      </div>

      {/* Legend with counts and percentages */}
      <div className="space-y-1.5 text-xs w-full max-w-xs">
        {slices.map((slice, i) => (
          <div key={i} className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 transition">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: slice.color }}></span>
              <span className="text-slate-700 font-medium text-[11px] truncate">{slice.label}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-800 text-[11px]">{slice.count}</span>
              <span className="text-slate-400 text-[10px] font-mono w-8 text-right">({slice.percentage}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
