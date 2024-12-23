import { DataItem, PieSlice } from './types';

export const calculateLabelPosition = (
  startAngle: number,
  angle: number,
  radius: number
) => {
  const midAngle = startAngle + angle / 2;
  // Position labels slightly outside the pie
  const labelRadius = radius * 0.6;
  return {
    x: Math.cos(midAngle) * labelRadius,
    y: Math.sin(midAngle) * labelRadius,
  };
};

export const calculateSlices = (data: DataItem[]): PieSlice[] => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  return data.map((item) => {
    const percentage = (item.value / total) * 100;
    const angle = (percentage / 100) * Math.PI * 2;
    
    // Calculate the path for the slice
    const startX = Math.cos(currentAngle) * 100;
    const startY = Math.sin(currentAngle) * 100;
    const endX = Math.cos(currentAngle + angle) * 100;
    const endY = Math.sin(currentAngle + angle) * 100;
    
    const largeArcFlag = angle > Math.PI ? 1 : 0;
    
    const path = `
      M 0 0
      L ${startX} ${startY}
      A 100 100 0 ${largeArcFlag} 1 ${endX} ${endY}
      Z
    `.trim();

    // Calculate label position
    const labelPos = calculateLabelPosition(currentAngle, angle, 100);

    const slice: PieSlice = {
      path,
      color: item.color,
      label: item.label,
      percentage,
      labelX: labelPos.x,
      labelY: labelPos.y,
      value: item.value

    };

    currentAngle += angle;
    return slice;
  });
};