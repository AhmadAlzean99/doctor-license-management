interface LogoMarkProps {
  className?: string;
}

export function LogoMark({ className }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="dl-shield" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2DD4BF" />
          <stop offset="0.55" stopColor="#0D9488" />
          <stop offset="1" stopColor="#065F46" />
        </linearGradient>
      </defs>

      <path
        d="M20 3.5
           C24.3 3.5 28.6 4.6 32.7 6.6
           C33.5 7 34 7.8 34 8.7
           V18.5
           C34 26.4 28.4 33 21 35.8
           C20.4 36.1 19.6 36.1 19 35.8
           C11.6 33 6 26.4 6 18.5
           V8.7
           C6 7.8 6.5 7 7.3 6.6
           C11.4 4.6 15.7 3.5 20 3.5 Z"
        fill="url(#dl-shield)"
      />

      <path
        d="M20 3.5 C24.3 3.5 28.6 4.6 32.7 6.6 C33.5 7 34 7.8 34 8.7 V17 C34 17 27 18 20 18 C13 18 6 17 6 17 V8.7 C6 7.8 6.5 7 7.3 6.6 C11.4 4.6 15.7 3.5 20 3.5 Z"
        fill="white"
        fillOpacity="0.12"
      />

      <path
        d="M13.5 20.5 L18 25 L26.5 15.5"
        stroke="white"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
