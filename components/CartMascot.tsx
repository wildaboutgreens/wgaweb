'use client';

export default function CartMascot({ className = 'w-40 h-40' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background soft sage/cream aura */}
      <ellipse cx="100" cy="180" rx="60" ry="8" fill="#E2EBE3" opacity="0.85" />

      {/* Frantic stress / lightning bolts - in organic green */}
      <path
        d="M130 35 L142 48 L136 50 L146 64"
        stroke="#2D7A4D"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M142 30 L152 40"
        stroke="#2D7A4D"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M125 24 L132 30"
        stroke="#2D7A4D"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Left anxiety sparks */}
      <path
        d="M68 45 L58 55 L64 57 L54 70"
        stroke="#2D7A4D"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />

      {/* Main Body - quirky living microgreens carton/tray */}
      {/* Soft natural green wash */}
      <path
        d="M75 55 
           L90 42 L100 52 L112 38 L126 55 
           L138 145 L62 145 Z"
        fill="#EDF5EE"
      />

      {/* Hand-drawn sketchy hatching lines inside */}
      <g stroke="#C2DCC7" strokeWidth="1.5" strokeLinecap="round" opacity="0.75">
        <line x1="78" y1="62" x2="88" y2="85" />
        <line x1="84" y1="60" x2="94" y2="88" />
        <line x1="90" y1="62" x2="98" y2="82" />
        <line x1="72" y1="95" x2="84" y2="125" />
        <line x1="78" y1="95" x2="90" y2="128" />
        <line x1="84" y1="100" x2="95" y2="132" />
      </g>

      {/* Outline in dark forest green */}
      <path
        d="M75 55 
           L88 43 L99 53 L113 39 L126 55 
           L138 145 
           L62 145 
           L75 55 Z"
        stroke="#1C3F2D"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Distressed facial expression */}
      {/* Furrowed eyebrows */}
      <path
        d="M80 82 L96 92"
        stroke="#1C3F2D"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M120 82 L104 92"
        stroke="#1C3F2D"
        strokeWidth="3.2"
        strokeLinecap="round"
      />

      {/* Frantic squinting eyes */}
      <path
        d="M84 94 L90 98 L84 102"
        stroke="#1C3F2D"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M116 94 L110 98 L116 102"
        stroke="#1C3F2D"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Squiggly distressed frown mouth */}
      <path
        d="M88 122 C95 116, 105 116, 114 122"
        stroke="#1C3F2D"
        strokeWidth="3.2"
        strokeLinecap="round"
      />

      {/* Frantic arms on hips */}
      <path
        d="M63 105 C50 112, 48 126, 60 135"
        stroke="#1C3F2D"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M137 105 C150 112, 152 126, 140 135"
        stroke="#1C3F2D"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Stumpy legs */}
      <path
        d="M80 146 L76 165"
        stroke="#1C3F2D"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M120 146 L124 165"
        stroke="#1C3F2D"
        strokeWidth="3.2"
        strokeLinecap="round"
      />

      {/* Vibrant living sprout on head */}
      <path
        d="M99 40 C95 26, 84 28, 83 33 C81 39, 91 41, 99 40 Z"
        fill="#CFFA57"
        stroke="#1C3F2D"
        strokeWidth="1.8"
      />
      <path
        d="M99 40 C103 26, 114 28, 115 33 C117 39, 107 41, 99 40 Z"
        fill="#93C285"
        stroke="#1C3F2D"
        strokeWidth="1.8"
      />
    </svg>
  );
}
