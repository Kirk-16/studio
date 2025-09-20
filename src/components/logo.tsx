import React from 'react';

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <g>
        <path
          d="M50 10 C 70 10, 85 25, 85 50 C 85 75, 70 90, 50 90 C 30 90, 15 75, 15 50 C 15 25, 30 10, 50 10 Z"
          stroke="hsl(var(--primary))"
          strokeWidth="8"
        />
        <text
          x="50"
          y="62"
          fontFamily="PT Sans, sans-serif"
          fontSize="40"
          fill="hsl(var(--accent))"
          textAnchor="middle"
          fontWeight="bold"
        >
          BS
        </text>
      </g>
    </svg>
  );
}
