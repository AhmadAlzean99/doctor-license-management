export function EmptyStateIllustration() {
  return (
    <svg
      width="140"
      height="140"
      viewBox="0 0 140 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="bg-grad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ccfbf1" />
          <stop offset="100%" stopColor="#f0fdfa" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="card-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f0fdfa" />
        </linearGradient>
      </defs>

      <circle cx="70" cy="70" r="60" fill="url(#bg-grad)" />

      <g transform="translate(34, 28)">
        <rect x="0" y="0" width="72" height="84" rx="8" fill="url(#card-grad)" stroke="#5eead4" strokeWidth="1.5" />
        <rect x="22" y="-4" width="28" height="10" rx="2" fill="#0d9488" />
        <rect x="10" y="20" width="52" height="3" rx="1.5" fill="#99f6e4" />
        <rect x="10" y="32" width="40" height="3" rx="1.5" fill="#99f6e4" />
        <rect x="10" y="44" width="44" height="3" rx="1.5" fill="#99f6e4" />
        <rect x="10" y="56" width="36" height="3" rx="1.5" fill="#99f6e4" />
        <circle cx="55" cy="70" r="8" fill="#10b981" />
        <path d="M51 70 L54 73 L59 67" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>

      <circle cx="22" cy="42" r="3" fill="#5eead4" opacity="0.8" />
      <circle cx="118" cy="58" r="2" fill="#5eead4" opacity="0.6" />
      <circle cx="28" cy="92" r="2" fill="#5eead4" opacity="0.7" />
      <circle cx="112" cy="100" r="3" fill="#5eead4" opacity="0.5" />
      <path d="M14 70 L20 70 M17 67 L17 73" stroke="#5eead4" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M120 30 L126 30 M123 27 L123 33" stroke="#5eead4" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
