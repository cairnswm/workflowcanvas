import React from 'react';

interface CustomMinimapNodeProps {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  strokeColor: string;
  strokeWidth: number;
  data?: {
    type?: string;
    label?: string;
  };
}

function CustomMinimapNode({
  x,
  y,
  width,
  height,
  color,
  strokeColor,
  strokeWidth,
  data,
}: CustomMinimapNodeProps) {
  const label = data?.label || '';
  const type = data?.type || 'default';

  const fontSize = Math.min(height * 0.8, width * 0.4);

  if (type === 'header') {
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={width / 2}
          y={height / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={fontSize}
          fontWeight="bold"
          fill="#000000"
        >
          {label}
        </text>
      </g>
    );
  }

  if (type === 'image') {
    return (
      <g transform={`translate(${x},${y})`}>
        <rect
          width={width}
          height={height}
          rx={4}
          fill="#F0F9FF"
          stroke="#0EA5E9"
          strokeWidth={strokeWidth}
        />
        <text
          x={width / 2}
          y={height / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={fontSize}
          fill="#0EA5E9"
        >
          IMG
        </text>
      </g>
    );
  }

  const maxChars = Math.floor(width / (fontSize * 0.4));
  const displayLabel = label.length > maxChars 
    ? label.slice(0, maxChars - 2) + '..'
    : label;

  return (
    <g transform={`translate(${x},${y})`}>
      <rect
        width={width}
        height={height}
        rx={4}
        fill={color}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
      <text
        x={width / 2}
        y={height / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={fontSize}
        fill="#000000"
      >
        {displayLabel}
      </text>
    </g>
  );
}

export default CustomMinimapNode;