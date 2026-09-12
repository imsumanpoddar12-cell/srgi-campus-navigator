import { useState } from "react";

interface SRGILogoProps {
  className?: string;
  size?: number;
  customLogoUrl?: string;
}

export default function SRGILogo({ className = "", size = 48, customLogoUrl }: SRGILogoProps) {
  const [hasError, setHasError] = useState(false);

  if (customLogoUrl && !hasError) {
    return (
      <img
        src={customLogoUrl}
        alt="SR Group of Institutions Logo"
        onError={() => setHasError(true)}
        className={`object-contain ${className}`}
        style={{ width: size, height: size * 1.15 }}
      />
    );
  }

  return (
    <div
      className={`inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size * 1.16 }}
      title="SR Group of Institutions (SRGI) Lucknow"
    >
      <svg
        viewBox="0 0 120 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="shieldBg" x1="60" y1="0" x2="60" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f8fafc" />
          </linearGradient>
          <linearGradient id="shieldBorder" x1="0" y1="0" x2="120" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="50%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#c2410c" />
          </linearGradient>
          <linearGradient id="ribbonGrad" x1="0" y1="100" x2="120" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ea580c" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
          <linearGradient id="gearGrad" x1="35" y1="35" x2="85" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="100%" stopColor="#172554" />
          </linearGradient>
        </defs>

        {/* Outer Shield Outline */}
        <path
          d="M60 4 C92 4 108 14 108 30 C108 72 88 102 60 114 C32 102 12 72 12 30 C12 14 28 4 60 4 Z"
          fill="url(#shieldBg)"
          stroke="url(#shieldBorder)"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Inner Shield Navy Border */}
        <path
          d="M60 9 C88 9 103 18 103 32 C103 68 85 96 60 107 C35 96 17 68 17 32 C17 18 32 9 60 9 Z"
          fill="none"
          stroke="#1e3a8a"
          strokeWidth="2.2"
        />

        {/* Text Arc Guide & Heading: S.R. GROUP OF INSTITUTIONS */}
        <path
          id="textArcPath"
          d="M 23 48 A 42 42 0 0 1 97 48"
          fill="none"
        />
        <text
          fontSize="6.2"
          fontWeight="800"
          fill="#1e3a8a"
          letterSpacing="0.4"
          fontFamily="system-ui, sans-serif"
        >
          <textPath href="#textArcPath" startOffset="50%" textAnchor="middle">
            S.R. GROUP OF INSTITUTIONS
          </textPath>
        </text>

        {/* Outer Gear Ring */}
        <g transform="translate(60, 60)">
          {/* Gear teeth */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <rect
              key={deg}
              x="-2.5"
              y="-22"
              width="5"
              height="6"
              rx="1.2"
              fill="#1e3a8a"
              transform={`rotate(${deg})`}
            />
          ))}
          {/* Navy outer ring */}
          <circle cx="0" cy="0" r="19" fill="#1e3a8a" />
          <circle cx="0" cy="0" r="16.5" fill="#ffffff" />

          {/* Orange Central Emblem */}
          <circle cx="0" cy="0" r="14.5" fill="#ea580c" />
          <circle cx="0" cy="0" r="13.5" stroke="#ffffff" strokeWidth="1" fill="#ea580c" />

          {/* Central 'SR' text */}
          <text
            x="0"
            y="4.8"
            fontSize="12.5"
            fontWeight="900"
            fill="#ffffff"
            textAnchor="middle"
            fontFamily="system-ui, sans-serif"
            letterSpacing="-0.5"
          >
            SR
          </text>
        </g>

        {/* LUCKNOW label */}
        <text
          x="60"
          y="93"
          fontSize="6.8"
          fontWeight="800"
          fill="#1e3a8a"
          textAnchor="middle"
          letterSpacing="1.2"
          fontFamily="system-ui, sans-serif"
        >
          LUCKNOW
        </text>

        {/* Lower Banner / Ribbon: SRGI */}
        <g>
          {/* Ribbon Shadow/Tails */}
          <path
            d="M 12 116 L 24 108 L 24 122 Z"
            fill="#9a3412"
          />
          <path
            d="M 108 116 L 96 108 L 96 122 Z"
            fill="#9a3412"
          />
          {/* Main Curved Banner */}
          <path
            d="M 14 116 Q 60 134 106 116 Q 94 130 60 132 Q 26 130 14 116 Z"
            fill="url(#ribbonGrad)"
            stroke="#ffffff"
            strokeWidth="1"
          />
          {/* SRGI Text on Ribbon */}
          <text
            x="60"
            y="126"
            fontSize="9"
            fontWeight="900"
            fill="#ffffff"
            textAnchor="middle"
            letterSpacing="2.5"
            fontFamily="system-ui, sans-serif"
          >
            SRGI
          </text>
        </g>
      </svg>
    </div>
  );
}
