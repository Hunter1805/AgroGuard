import React from 'react';

export const AgroGuardIcon: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => {
  return (
    <svg className={className} viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer Shield Outline */}
      <path
        d="M100 8 C145 22 180 32 184 45 C186 115 158 172 100 228 C42 172 14 115 16 45 C20 32 55 22 100 8 Z"
        fill="#091421"
        stroke="#4CAF50"
        strokeWidth="12"
        strokeLinejoin="round"
      />
      
      {/* Tractor Body */}
      {/* Rear Large Wheel */}
      <circle cx="62" cy="112" r="28" fill="#16202E" stroke="#78DC77" strokeWidth="7" />
      <circle cx="62" cy="112" r="12" fill="#78DC77" />
      <circle cx="62" cy="112" r="5" fill="#091421" />

      {/* Front Wheel */}
      <circle cx="146" cy="118" r="18" fill="#16202E" stroke="#78DC77" strokeWidth="5" />
      <circle cx="146" cy="118" r="7" fill="#78DC77" />
      <circle cx="146" cy="118" r="3" fill="#091421" />

      {/* Cabin Structure */}
      <path
        d="M72 62 H114 L122 88 H68 Z"
        fill="#78DC77"
      />
      <rect x="76" y="66" width="32" height="18" fill="#091421" rx="2" />
      <path d="M70 60 L60 88 H126 L120 60 Z" stroke="#16202E" strokeWidth="4" fill="none" />

      {/* Hood and Front Grill */}
      <path d="M112 85 H156 V112 H124 Z" fill="#78DC77" />
      <rect x="146" y="90" width="8" height="16" fill="#16202E" rx="1" />
      {/* Exhaust pipe */}
      <rect x="124" y="60" width="4" height="25" fill="#16202E" />

      {/* Field Rows */}
      <g>
        <path d="M30 135 C60 128 140 128 170 135 L155 180 C130 195 100 205 100 205 C100 205 70 195 45 180 Z" fill="#2E7D32" />
        <path d="M42 142 Q100 130 158 142" stroke="#78DC77" strokeWidth="4" fill="none" />
        <path d="M52 156 Q100 144 148 156" stroke="#78DC77" strokeWidth="4" fill="none" />
        <path d="M64 170 Q100 160 136 170" stroke="#78DC77" strokeWidth="3" fill="none" />
      </g>

      {/* Wrench Symbol at Shield Tip */}
      <path
        d="M100 180 V205 M95 180 H105 M94 186 C90 186 88 182 92 176 C96 172 104 172 108 176 C112 182 110 186 106 186"
        stroke="#091421"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const AgroGuardLogo: React.FC<{ showSubtitle?: boolean; size?: 'sm' | 'md' | 'lg' }> = ({
  showSubtitle = true,
  size = 'md',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const titleSizes = {
    sm: 'text-[18px]',
    md: 'text-[22px]',
    lg: 'text-[28px]',
  };

  return (
    <div className="flex items-center gap-3 select-none">
      <AgroGuardIcon className={iconSizes[size]} />
      <div>
        <div className={`font-title-md font-bold ${titleSizes[size]} leading-none tracking-tight flex items-center`}>
          <span className="text-on-surface">Agro</span>
          <span className="text-primary ml-0.5">Guard</span>
        </div>
        {showSubtitle && (
          <p className="font-label-caps text-[9.5px] text-on-surface-variant/70 tracking-wider uppercase mt-1">
            Gestão de Ativos
          </p>
        )}
      </div>
    </div>
  );
};
