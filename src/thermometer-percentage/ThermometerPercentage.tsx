export default function ThermometerPercentage({
  strokeColor = "black",
  strokeWidth = 2,
  startColor = "lightgray",
  stopColor = "white",
  percentage = 0,
  id
}: {
  strokeColor?: string;
  strokeWidth?: number;
  startColor?: string;
  stopColor?: string;
  percentage: number;
  id: string;
}) {
  const getId = () => {
    return `perc-grad-${id}`;
  };

  return (
    <svg width="22" height="36" viewBox="0 0 22 26">
      <defs>
        <linearGradient id={getId()} x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor={startColor} />
          <stop offset={`${percentage}%`} stopColor={startColor} />
          <stop offset={`${percentage}%`} stopColor={stopColor} />
          <stop offset="100%" stopColor={stopColor} />
        </linearGradient>
      </defs>
      <g
        fill={`url(#${getId()})`}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path>
      </g>
    </svg>
  );
}
