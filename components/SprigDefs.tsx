export default function SprigDefs() {
  return (
    <svg style={{ display: 'none' }} aria-hidden="true">
      <clipPath id="heartClip" clipPathUnits="objectBoundingBox">
        <path d="M0.5,1 C0.5,1 0,0.66 0,0.34 C0,0.14 0.15,0.02 0.28,0.02 C0.4,0.02 0.47,0.11 0.5,0.18 C0.53,0.11 0.6,0.02 0.72,0.02 C0.85,0.02 1,0.14 1,0.34 C1,0.66 0.5,1 0.5,1 Z" />
      </clipPath>
      <symbol id="sprig" viewBox="0 0 80 120">
        <path
          d="M40 118C40 78 34 58 34 38C34 22 40 8 40 8"
          stroke="currentColor"
          strokeWidth="2.4"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M39 84C30 82 20 74 18 62c11-1 19 6 21 16z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path
          d="M41 84c9-2 19-10 21-22-11-1-19 6-21 16z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path
          d="M39 56C31 55 22 48 20 38c10-1 17 5 19 13z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path
          d="M41 56c8-1 17-8 19-18-10-1-17 5-19 13z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path
          d="M40 30c-6-1-12-7-13-15 8-1 13 5 14 11z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M40 30c6-1 12-7 13-15-8-1-13 5-14 11z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </symbol>
    </svg>
  );
}

export function Sprig({
  rotation = '0deg',
  width = '48px',
  className = '',
  delay = '0s',
  style = {},
}: {
  rotation?: string;
  width?: string;
  className?: string;
  delay?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`sprig ${className}`}
      style={
        {
          '--r': rotation,
          width,
          animationDelay: delay,
          ...style,
        } as React.CSSProperties
      }
    >
      <svg>
        <use href="#sprig" />
      </svg>
    </div>
  );
}
