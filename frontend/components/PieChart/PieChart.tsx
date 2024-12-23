import React from 'react';
import { calculateSlices } from './utils';
import { PieChartProps, PieSlice } from './types';

export const PieChart: React.FC<PieChartProps> = ({
  data,
  width = 200,
  height = 200,
  className = '',
}) => {
  const radius = Math.min(width, height) / 2;
  const centerX = width / 2;
  const centerY = height / 2;
  const slices = calculateSlices(data);

  return (
    <svg width={width} height={height} className={className}>
      <g transform={`translate(${centerX},${centerY})`}>
        {slices.map((slice: PieSlice, index: number) => (
          <React.Fragment key={index}>
            <path
              d={slice.path}
              fill={slice.color}
              className="transition-all duration-300 hover:opacity-80"
            >
              <title>{`${slice.label}: ${slice.value}`}</title>
            </path>
            {slice.percentage > 5 && (
              <>
                <text
                  x={slice.labelX}
                  y={slice.labelY - 8}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-white text-sm font-medium pointer-events-none"
                  style={{
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                  }}
                >
                  {slice.label}
                </text>
                <text
                  x={slice.labelX}
                  y={slice.labelY + 8}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-white text-xs font-medium pointer-events-none"
                  style={{
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                  }}
                >
                  {slice.value}
                </text>
              </>
            )}
          </React.Fragment>
        ))}
      </g>
      <g transform={`translate(${width + 20}, 20)`}>
        {slices.map((slice: PieSlice, index: number) => (
          <g
            key={index}
            transform={`translate(0, ${index * 20})`}
            className="text-sm"
          >
            <rect
              width="10"
              height="10"
              fill={slice.color}
              className="hover:opacity-80"
            />
            <text x="20" y="10" className="fill-current">
              {slice.label} ({slice.value})
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
};