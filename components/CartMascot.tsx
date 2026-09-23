'use client';

interface CartMascotProps {
  className?: string;
  variant?: 'pleading' | 'dramatic' | 'angry' | string;
}

export default function CartMascot({
  className = 'w-40 h-40',
  variant = 'pleading',
}: CartMascotProps) {
  // 1. PLEADING / STARVING SPROUT (Default New Variation)
  if (variant === 'pleading') {
    return (
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Soft natural aura shadow */}
        <ellipse cx="100" cy="180" rx="58" ry="8" fill="#E2EBE3" opacity="0.9" />

        {/* Floating hungry sparkles / appetite steam */}
        <path
          d="M142 42 Q148 34 144 26"
          stroke="#3E8F52"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.75"
        />
        <path
          d="M152 48 Q158 40 154 32"
          stroke="#3E8F52"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.6"
        />
        <circle cx="140" cy="60" r="2.5" fill="#CFFA57" />
        <circle cx="56" cy="46" r="2" fill="#3E8F52" opacity="0.7" />
        <path
          d="M58 36 Q52 28 56 20"
          stroke="#3E8F52"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Main Body - living microgreens carton */}
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

        {/* Worried / Pleading Eyebrows (Arched high & inward) */}
        <path
          d="M78 78 Q88 74 96 82"
          stroke="#1C3F2D"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <path
          d="M122 78 Q112 74 104 82"
          stroke="#1C3F2D"
          strokeWidth="2.8"
          strokeLinecap="round"
        />

        {/* Giant Glossy Puppy-Dog Eyes (Pleading for microgreens!) */}
        {/* Left Eye */}
        <ellipse cx="86" cy="96" rx="8.5" ry="10" fill="#1C3F2D" />
        <circle cx="83.5" cy="92.5" r="3.2" fill="#FFFDF8" />
        <circle cx="88.5" cy="98.5" r="1.6" fill="#FFFDF8" />

        {/* Right Eye */}
        <ellipse cx="114" cy="96" rx="8.5" ry="10" fill="#1C3F2D" />
        <circle cx="111.5" cy="92.5" r="3.2" fill="#FFFDF8" />
        <circle cx="116.5" cy="98.5" r="1.6" fill="#FFFDF8" />

        {/* Rosy/Nutrient blush on cheeks */}
        <ellipse cx="74" cy="106" rx="5" ry="2.5" fill="#FFC9C0" opacity="0.85" />
        <ellipse cx="126" cy="106" rx="5" ry="2.5" fill="#FFC9C0" opacity="0.85" />

        {/* Tiny Dramatic Tear/Sweat Droplet */}
        <path
          d="M69 94 Q67 87 69 83 Q74 87 72 94 Z"
          fill="#BEE3F5"
          stroke="#1C3F2D"
          strokeWidth="1.2"
        />

        {/* Trembling / Hungry Pout Mouth */}
        <path
          d="M93 118 Q100 125 107 118"
          stroke="#1C3F2D"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        {/* Quivering lower lip dot */}
        <path
          d="M97 122 Q100 124 103 122"
          stroke="#1C3F2D"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Arms clutching tummy (Hungry for greens!) */}
        <path
          d="M62 108 Q52 118 68 126 Q82 130 92 126"
          stroke="#1C3F2D"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <path
          d="M138 108 Q148 118 132 126 Q118 130 108 126"
          stroke="#1C3F2D"
          strokeWidth="2.8"
          strokeLinecap="round"
        />

        {/* Stumpy little legs */}
        <path
          d="M82 146 L79 164"
          stroke="#1C3F2D"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path
          d="M118 146 L121 164"
          stroke="#1C3F2D"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* Sprout on head - slightly droopy & hungry */}
        <path
          d="M99 40 C94 28, 81 30, 80 37 C79 43, 90 43, 99 40 Z"
          fill="#CFFA57"
          stroke="#1C3F2D"
          strokeWidth="1.8"
        />
        <path
          d="M99 40 C104 29, 116 31, 116 38 C117 43, 107 43, 99 40 Z"
          fill="#93C285"
          stroke="#1C3F2D"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  // 2. DRAMATIC / "I'M COMPOSTING!" SPROUT
  if (variant === 'dramatic') {
    return (
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <ellipse cx="100" cy="180" rx="58" ry="8" fill="#E2EBE3" opacity="0.9" />

        {/* Melodramatic floating sigh bubbles */}
        <path
          d="M140 38 Q145 28 138 20"
          stroke="#9C4A5C"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
        />
        <circle cx="150" cy="30" r="3" fill="#FFC9C0" />
        <circle cx="158" cy="22" r="1.5" fill="#9C4A5C" />

        {/* Main Body */}
        <path
          d="M75 55 
             L90 42 L100 52 L112 38 L126 55 
             L138 145 L62 145 Z"
          fill="#EDF5EE"
        />

        {/* Hatching lines inside */}
        <g stroke="#C2DCC7" strokeWidth="1.5" strokeLinecap="round" opacity="0.75">
          <line x1="78" y1="62" x2="88" y2="85" />
          <line x1="84" y1="60" x2="94" y2="88" />
          <line x1="90" y1="62" x2="98" y2="82" />
          <line x1="72" y1="95" x2="84" y2="125" />
          <line x1="78" y1="95" x2="90" y2="128" />
        </g>

        {/* Outline */}
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

        {/* Dramatic swoon brow */}
        <path d="M78 80 Q88 72 96 82" stroke="#1C3F2D" strokeWidth="2.8" strokeLinecap="round" />
        <path d="M122 80 Q112 72 104 82" stroke="#1C3F2D" strokeWidth="2.8" strokeLinecap="round" />

        {/* Tragic closed swoon eyes (> < or ^ ^) */}
        <path d="M80 94 L87 90 L94 94" stroke="#1C3F2D" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M106 94 L113 90 L120 94" stroke="#1C3F2D" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />

        {/* Dramatic gasp mouth: 'D:' or open tragic gasp */}
        <ellipse cx="100" cy="116" rx="7" ry="9" fill="#1C3F2D" />
        <ellipse cx="100" cy="118" rx="4" ry="4" fill="#FF9F5A" opacity="0.7" />

        {/* Dramatic Victorian fainting hand to forehead */}
        <path
          d="M62 110 Q50 92 68 76 Q78 70 86 78"
          stroke="#1C3F2D"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Other hand limp at side */}
        <path
          d="M138 112 Q148 126 136 138"
          stroke="#1C3F2D"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Stumpy legs */}
        <path d="M80 146 L76 165" stroke="#1C3F2D" strokeWidth="3.2" strokeLinecap="round" />
        <path d="M120 146 L124 165" stroke="#1C3F2D" strokeWidth="3.2" strokeLinecap="round" />

        {/* Fainting sprout drooping completely */}
        <path
          d="M99 40 C95 24, 80 26, 78 34 C76 40, 88 42, 99 40 Z"
          fill="#CFFA57"
          stroke="#1C3F2D"
          strokeWidth="1.8"
        />
        <path
          d="M99 40 C108 30, 126 36, 122 46 C118 52, 106 44, 99 40 Z"
          fill="#93C285"
          stroke="#1C3F2D"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  // 3. ANGRY / FRANTIC STRESS CART (Original)
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
