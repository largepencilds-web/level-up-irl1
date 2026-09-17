import React from 'react';
import { motion } from 'motion/react';
import { CharacterAppearance } from '../../types';

interface CharacterAvatarProps {
  character: CharacterAppearance;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  animate?: boolean;
  className?: string;
  onClick?: () => void;
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  character,
  size = 'md',
  animate = true,
  className = '',
  onClick,
}) => {
  const sizeMap = {
    xs: 'w-7 h-7',
    sm: 'w-11 h-11',
    md: 'w-18 h-18',
    lg: 'w-28 h-28',
    xl: 'w-48 h-48',
    hero: 'w-64 h-64 sm:w-72 sm:h-72',
  };

  const {
    skinTone = '#ffd1aa',
    hairStyle = 'short_neat',
    hairColor = '#0f172a',
    eyesStyle = 'focused',
    topStyle = 'starter_tee',
    pantsStyle = 'joggers',
    shoesStyle = 'sneakers_white',
    accessoryStyle = 'wireless_headphones',
    auraStyle = 'none',
  } = character || {};

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center select-none ${sizeMap[size]} ${className}`}
    >
      {/* Background Aura if active */}
      {auraStyle === 'blue_sparkle' && (
        <div className="absolute inset-0 -m-3 rounded-full bg-blue-500/20 blur-xl animate-pulse pointer-events-none" />
      )}
      {auraStyle === 'golden' && (
        <div className="absolute inset-0 -m-4 rounded-full bg-amber-500/25 blur-xl animate-pulse pointer-events-none" />
      )}
      {auraStyle === 'cosmic' && (
        <div className="absolute inset-0 -m-4 rounded-full bg-purple-500/25 blur-xl animate-pulse pointer-events-none" />
      )}

      {/* Main SVG Avatar Container */}
      <motion.svg
        viewBox="0 0 200 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md overflow-visible"
        animate={
          animate && size !== 'xs'
            ? {
                y: [0, -3, 0],
                transition: {
                  duration: 3.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }
            : undefined
        }
      >
        <defs>
          {/* Subtle gradients */}
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="clothShade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="capeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
          <linearGradient id="cyberNeon" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>

        {/* Back Cape (if equipped) */}
        {accessoryStyle === 'champion_cape' && (
          <path
            d="M 50 120 C 30 180, 20 220, 35 235 C 50 240, 150 240, 165 235 C 180 220, 170 180, 150 120 Z"
            fill="url(#capeGrad)"
            opacity="0.95"
          />
        )}

        {/* Shoes Layer */}
        <g id="shoes-layer">
          {shoesStyle === 'combat_boots' ? (
            <>
              {/* Left Boot */}
              <rect x="68" y="212" width="26" height="22" rx="5" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
              <rect x="64" y="226" width="32" height="8" rx="3" fill="#0f172a" />
              {/* Right Boot */}
              <rect x="106" y="212" width="26" height="22" rx="5" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
              <rect x="104" y="226" width="32" height="8" rx="3" fill="#0f172a" />
            </>
          ) : shoesStyle === 'runners_neon' ? (
            <>
              {/* Neon Runners */}
              <rect x="68" y="216" width="26" height="18" rx="6" fill="#0ea5e9" />
              <path d="M 64 228 Q 80 226 96 230 L 96 234 L 64 234 Z" fill="#38bdf8" />
              <rect x="106" y="216" width="26" height="18" rx="6" fill="#0ea5e9" />
              <path d="M 104 228 Q 120 226 136 230 L 136 234 L 104 234 Z" fill="#38bdf8" />
            </>
          ) : shoesStyle === 'high_tops' ? (
            <>
              {/* Golden High Tops */}
              <rect x="68" y="212" width="26" height="22" rx="6" fill="#f59e0b" />
              <rect x="64" y="226" width="32" height="8" rx="3" fill="#ffffff" />
              <rect x="106" y="212" width="26" height="22" rx="6" fill="#f59e0b" />
              <rect x="104" y="226" width="32" height="8" rx="3" fill="#ffffff" />
            </>
          ) : (
            <>
              {/* Clean White Lows */}
              <rect x="68" y="218" width="26" height="16" rx="5" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
              <rect x="66" y="228" width="30" height="6" rx="2" fill="#e2e8f0" />
              <rect x="106" y="218" width="26" height="16" rx="5" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
              <rect x="104" y="228" width="30" height="6" rx="2" fill="#e2e8f0" />
            </>
          )}
        </g>

        {/* Legs / Pants Layer */}
        <g id="pants-layer">
          {pantsStyle === 'cargo_dark' ? (
            <>
              {/* Left Cargo leg */}
              <rect x="68" y="160" width="26" height="56" rx="4" fill="#1e293b" />
              {/* Right Cargo leg */}
              <rect x="106" y="160" width="26" height="56" rx="4" fill="#1e293b" />
              {/* Pocket straps */}
              <rect x="64" y="178" width="8" height="18" rx="2" fill="#334155" />
              <rect x="128" y="178" width="8" height="18" rx="2" fill="#334155" />
            </>
          ) : pantsStyle === 'denim_jeans' ? (
            <>
              <rect x="68" y="160" width="26" height="56" rx="4" fill="#2563eb" />
              <rect x="106" y="160" width="26" height="56" rx="4" fill="#2563eb" />
              {/* Subtle seam */}
              <line x1="81" y1="165" x2="81" y2="210" stroke="#1d4ed8" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="119" y1="165" x2="119" y2="210" stroke="#1d4ed8" strokeWidth="1.5" strokeDasharray="3 3" />
            </>
          ) : pantsStyle === 'cyber_pants' ? (
            <>
              <rect x="68" y="160" width="26" height="56" rx="4" fill="#0f172a" />
              <rect x="106" y="160" width="26" height="56" rx="4" fill="#0f172a" />
              {/* Neon Grid stripes */}
              <line x1="72" y1="162" x2="72" y2="212" stroke="#38bdf8" strokeWidth="2" />
              <line x1="128" y1="162" x2="128" y2="212" stroke="#38bdf8" strokeWidth="2" />
            </>
          ) : (
            <>
              {/* Basic Navy Joggers */}
              <rect x="68" y="160" width="26" height="56" rx="6" fill="#1e1b4b" />
              <rect x="106" y="160" width="26" height="56" rx="6" fill="#1e1b4b" />
              {/* Cuffs */}
              <rect x="68" y="210" width="26" height="6" rx="2" fill="#312e81" />
              <rect x="106" y="210" width="26" height="6" rx="2" fill="#312e81" />
            </>
          )}
          {/* Waistband */}
          <rect x="66" y="156" width="68" height="10" rx="3" fill="#0f172a" opacity="0.6" />
        </g>

        {/* Torso / Clothing Layer */}
        <g id="top-layer">
          {topStyle === 'hoodie' ? (
            <>
              {/* Cozy Oversized Hoodie */}
              <path
                d="M 50 118 L 65 96 L 135 96 L 150 118 L 144 164 L 56 164 Z"
                fill="#334155"
              />
              {/* Hoodie pocket */}
              <rect x="74" y="138" width="52" height="18" rx="5" fill="#1e293b" />
              {/* Drawstrings */}
              <path d="M 92 108 L 92 128" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
              <path d="M 108 108 L 108 128" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
              {/* Arms */}
              <rect x="38" y="112" width="20" height="42" rx="8" fill="#334155" transform="rotate(8 38 112)" />
              <rect x="142" y="112" width="20" height="42" rx="8" fill="#334155" transform="rotate(-8 142 112)" />
            </>
          ) : topStyle === 'athletic_jacket' ? (
            <>
              {/* Aero Velocity Track Jacket */}
              <path
                d="M 52 118 L 68 96 L 132 96 L 148 118 L 142 164 L 58 164 Z"
                fill="#1e40af"
              />
              {/* Chest contrast stripe */}
              <path d="M 56 126 L 144 126" stroke="#38bdf8" strokeWidth="4" />
              {/* Zipper */}
              <line x1="100" y1="96" x2="100" y2="164" stroke="#ffffff" strokeWidth="2" />
              {/* Arms */}
              <rect x="40" y="112" width="18" height="44" rx="8" fill="#1e40af" transform="rotate(8 40 112)" />
              <rect x="142" y="112" width="18" height="44" rx="8" fill="#1e40af" transform="rotate(-8 142 112)" />
            </>
          ) : topStyle === 'cyber_vest' ? (
            <>
              {/* Cyber Vest & Under-armor */}
              <rect x="62" y="100" width="76" height="64" rx="6" fill="#0f172a" />
              <path d="M 66 100 L 90 100 L 90 160 L 66 160 Z" fill="#1e293b" />
              <path d="M 110 100 L 134 100 L 134 160 L 110 160 Z" fill="#1e293b" />
              {/* Core glow */}
              <circle cx="100" cy="128" r="8" fill="#06b6d4" opacity="0.9" />
              <circle cx="100" cy="128" r="4" fill="#ffffff" />
              {/* Tactical clips */}
              <rect x="72" y="118" width="12" height="6" rx="2" fill="#06b6d4" />
              <rect x="116" y="118" width="12" height="6" rx="2" fill="#06b6d4" />
              {/* Arms */}
              <rect x="42" y="110" width="18" height="44" rx="8" fill="#1e293b" transform="rotate(8 42 110)" />
              <rect x="140" y="110" width="18" height="44" rx="8" fill="#1e293b" transform="rotate(-8 140 110)" />
            </>
          ) : topStyle === 'mage_robe' ? (
            <>
              {/* Solar Eclipse Duster */}
              <path
                d="M 48 116 L 66 94 L 134 94 L 152 116 L 146 172 L 54 172 Z"
                fill="#4c1d95"
              />
              <path d="M 100 94 L 80 172 L 120 172 Z" fill="#f59e0b" opacity="0.7" />
              <circle cx="100" cy="116" r="6" fill="#fbbf24" />
              <rect x="38" y="110" width="20" height="48" rx="8" fill="#4c1d95" transform="rotate(8 38 110)" />
              <rect x="142" y="110" width="20" height="48" rx="8" fill="#4c1d95" transform="rotate(-8 142 110)" />
            </>
          ) : (
            <>
              {/* Slate Starter Tee */}
              <path
                d="M 54 116 L 68 98 L 132 98 L 146 116 L 140 162 L 60 162 Z"
                fill="#1e293b"
              />
              {/* Crewneck collar */}
              <path d="M 86 98 Q 100 112 114 98" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
              {/* Sleeves & Bare arms */}
              <rect x="44" y="110" width="18" height="22" rx="6" fill="#1e293b" transform="rotate(8 44 110)" />
              <rect x="47" y="128" width="14" height="26" rx="6" fill={skinTone} transform="rotate(8 47 128)" />
              <rect x="138" y="110" width="18" height="22" rx="6" fill="#1e293b" transform="rotate(-8 138 110)" />
              <rect x="139" y="128" width="14" height="26" rx="6" fill={skinTone} transform="rotate(-8 139 128)" />
            </>
          )}
        </g>

        {/* Neck */}
        <rect x="88" y="86" width="24" height="20" rx="4" fill={skinTone} />

        {/* Head / Face */}
        <g id="head-layer">
          {/* Head Base */}
          <rect x="68" y="32" width="64" height="68" rx="28" fill={skinTone} />
          {/* Ears */}
          <circle cx="66" cy="66" r="8" fill={skinTone} />
          <circle cx="134" cy="66" r="8" fill={skinTone} />

          {/* Eyes Expressions */}
          <g id="eyes">
            {eyesStyle === 'cheerful' ? (
              <>
                <path d="M 80 62 Q 88 54 94 62" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M 106 62 Q 112 54 120 62" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
                <ellipse cx="76" cy="72" rx="4" ry="2" fill="#f43f5e" opacity="0.35" />
                <ellipse cx="124" cy="72" rx="4" ry="2" fill="#f43f5e" opacity="0.35" />
              </>
            ) : eyesStyle === 'sharp' ? (
              <>
                <path d="M 78 58 L 94 64" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
                <path d="M 122 58 L 106 64" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
                <circle cx="86" cy="66" r="4.5" fill="#0f172a" />
                <circle cx="114" cy="66" r="4.5" fill="#0f172a" />
                <circle cx="87" cy="64" r="1.5" fill="#ffffff" />
                <circle cx="115" cy="64" r="1.5" fill="#ffffff" />
              </>
            ) : (
              <>
                {/* Focused Default */}
                <circle cx="84" cy="64" r="5" fill="#0f172a" />
                <circle cx="116" cy="64" r="5" fill="#0f172a" />
                {/* Eye highlights */}
                <circle cx="86" cy="62" r="2" fill="#ffffff" />
                <circle cx="118" cy="62" r="2" fill="#ffffff" />
                {/* Eyebrows */}
                <line x1="78" y1="54" x2="90" y2="54" stroke={hairColor} strokeWidth="2.5" strokeLinecap="round" />
                <line x1="110" y1="54" x2="122" y2="54" stroke={hairColor} strokeWidth="2.5" strokeLinecap="round" />
              </>
            )}
          </g>

          {/* Nose & Friendly Smile */}
          <circle cx="100" cy="72" r="1.5" fill="#a16207" opacity="0.4" />
          <path d="M 94 80 Q 100 86 106 80" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* Hairstyle Layer */}
        <g id="hair-layer">
          {hairStyle === 'undercut' ? (
            <>
              {/* Fade sides */}
              <rect x="66" y="44" width="8" height="28" rx="3" fill={hairColor} opacity="0.6" />
              <rect x="126" y="44" width="8" height="28" rx="3" fill={hairColor} opacity="0.6" />
              {/* Voluminous textured top */}
              <path
                d="M 64 42 C 60 20, 85 14, 100 14 C 120 14, 140 22, 136 44 C 128 32, 105 28, 86 34 C 74 38, 68 44, 64 42 Z"
                fill={hairColor}
              />
            </>
          ) : hairStyle === 'curly' ? (
            <>
              {/* Curly clouds */}
              <circle cx="70" cy="36" r="14" fill={hairColor} />
              <circle cx="86" cy="24" r="16" fill={hairColor} />
              <circle cx="108" cy="22" r="16" fill={hairColor} />
              <circle cx="126" cy="32" r="15" fill={hairColor} />
              <circle cx="64" cy="52" r="12" fill={hairColor} />
              <circle cx="134" cy="50" r="12" fill={hairColor} />
            </>
          ) : hairStyle === 'spiky' ? (
            <>
              <path
                d="M 66 42 L 60 20 L 76 30 L 86 12 L 100 28 L 116 10 L 124 28 L 140 18 L 134 44 Z"
                fill={hairColor}
              />
            </>
          ) : hairStyle === 'braids' ? (
            <>
              {/* Braided Crown & strands */}
              <rect x="66" y="24" width="68" height="22" rx="10" fill={hairColor} />
              {/* Braids hanging */}
              <rect x="62" y="42" width="8" height="46" rx="4" fill={hairColor} />
              <rect x="130" y="42" width="8" height="46" rx="4" fill={hairColor} />
              <circle cx="66" cy="84" r="4" fill="#38bdf8" />
              <circle cx="134" cy="84" r="4" fill="#38bdf8" />
            </>
          ) : (
            <>
              {/* Clean Short Classic */}
              <path
                d="M 66 46 C 64 24, 80 18, 100 18 C 120 18, 136 24, 134 46 C 126 34, 108 30, 96 34 C 82 38, 72 44, 66 46 Z"
                fill={hairColor}
              />
            </>
          )}
        </g>

        {/* Accessories Layer */}
        <g id="accessory-layer">
          {accessoryStyle === 'wireless_headphones' && (
            <>
              {/* Headband arch */}
              <path d="M 62 66 C 60 16, 140 16, 138 66" stroke="#0ea5e9" strokeWidth="5" strokeLinecap="round" />
              {/* Ear Cups */}
              <rect x="56" y="52" width="14" height="26" rx="7" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
              <rect x="130" y="52" width="14" height="26" rx="7" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
            </>
          )}

          {accessoryStyle === 'cool_shades' && (
            <>
              {/* Sunglasses Frame */}
              <path d="M 72 60 L 98 60 L 94 72 L 74 72 Z" fill="#0f172a" stroke="#475569" strokeWidth="2" />
              <path d="M 102 60 L 128 60 L 126 72 L 106 72 Z" fill="#0f172a" stroke="#475569" strokeWidth="2" />
              {/* Bridge */}
              <line x1="98" y1="62" x2="102" y2="62" stroke="#64748b" strokeWidth="2" />
              {/* Glare */}
              <line x1="76" y1="63" x2="84" y2="69" stroke="#94a3b8" strokeWidth="1.5" />
            </>
          )}

          {accessoryStyle === 'cyber_visor' && (
            <>
              {/* Holographic Cyan Visor */}
              <rect x="68" y="56" width="64" height="18" rx="5" fill="#06b6d4" opacity="0.8" stroke="#38bdf8" strokeWidth="2" />
              <line x1="74" y1="62" x2="94" y2="62" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
              <circle cx="120" cy="65" r="3" fill="#ffffff" />
            </>
          )}

          {accessoryStyle === 'cat_ears' && (
            <>
              {/* Cat Ears */}
              <polygon points="70,26 84,36 68,44" fill="#ec4899" stroke="#f472b6" strokeWidth="2" />
              <polygon points="130,26 116,36 132,44" fill="#ec4899" stroke="#f472b6" strokeWidth="2" />
              <polygon points="72,30 80,36 71,40" fill="#fbcfe8" />
              <polygon points="128,30 120,36 129,40" fill="#fbcfe8" />
            </>
          )}
        </g>
      </motion.svg>
    </div>
  );
};
