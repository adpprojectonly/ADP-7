export interface DataItem {
  label: string;
  value: number;
  color: string;
}

export interface PieChartProps {
  data: DataItem[];
  width?: number;
  height?: number;
  className?: string;
}

export interface PieSlice {
  path: string;
  color: string;
  label: string;
  percentage: number;
  labelX: number;
  labelY: number;
  value: number;
}