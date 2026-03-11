import { cn } from "@/lib/utils";

interface HCGLogoProps {
  size?: number;
  className?: string;
  /** Show only the hexagon mark (no wordmark) */
  markOnly?: boolean;
  /** Show the full horizontal lockup: mark + wordmark */
  horizontal?: boolean;
  /** variant: 'blue' (default) | 'gold' | 'white' | 'monochrome' */
  variant?: "blue" | "gold" | "white" | "monochrome";
}

/** Hexagonal HC mark — the HCG monogram badge */
export function HCGMark({
  size = 40,
  variant = "blue",
  className,
}: {
  size?: number;
  variant?: HCGLogoProps["variant"];
  className?: string;
}) {
  const gradId = `hcgGrad-${size}-${variant}`;
  const shadowId = `hcgShadow-${size}-${variant}`;

  const gradColors: Record<string, [string, string]> = {
    blue: ["#3B7BF0", "#00B4FF"],
    gold: ["#CC9200", "#FFD466"],
    white: ["#CCCCCC", "#FFFFFF"],
    monochrome: ["#444444", "#888888"],
  };
  const [gradStart, gradEnd] = gradColors[variant ?? "blue"];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 116"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={gradStart} />
          <stop offset="100%" stopColor={gradEnd} />
        </linearGradient>
        <filter id={shadowId}>
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={gradEnd} floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Hexagon body — pointy-top orientation */}
      <polygon
        points="50,4 93,28 93,88 50,112 7,88 7,28"
        fill={`url(#${gradId})`}
        filter={`url(#${shadowId})`}
      />

      {/* Inner bevel highlight */}
      <polygon
        points="50,10 88,31.5 88,84.5 50,106 12,84.5 12,31.5"
        fill="none"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1.5"
      />

      {/* Bottom bevel shadow */}
      <polygon
        points="50,112 7,88 7,28"
        fill="rgba(0,0,0,0.15)"
        clipPath="polygon(50,112 7,88 7,28 50,4 93,28 93,88)"
      />

      {/* HC Letterform — H */}
      {/* H left stem */}
      <rect x="22" y="36" width="8" height="44" rx="1" fill="white" />
      {/* H right stem (shortened — shares space with C) */}
      <rect x="44" y="36" width="8" height="44" rx="1" fill="white" />
      {/* H crossbar */}
      <rect x="22" y="55" width="30" height="7" rx="1" fill="white" />

      {/* C arc — center at x=52, y=58, radius 22 */}
      {/* Opening to the right, gap at right side */}
      <path
        d="M 52,37 A 21,21 0 1 0 52,79"
        fill="none"
        stroke="white"
        strokeWidth="8"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Full wordmark: HC mark + "HIGH CALIBER GAMING" text */
export function HCGLogo({
  size = 40,
  className,
  variant = "blue",
  horizontal = true,
  markOnly = false,
}: HCGLogoProps) {
  if (markOnly) {
    return <HCGMark size={size} variant={variant} className={className} />;
  }

  const textColors: Record<string, string> = {
    blue: "#00B4FF",
    gold: "#FFB800",
    white: "#FFFFFF",
    monochrome: "#888888",
  };
  const accent = textColors[variant ?? "blue"];

  if (horizontal) {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <HCGMark size={size} variant={variant} />
        <div className="flex flex-col leading-none">
          <span
            className="font-azonix tracking-widest uppercase text-white"
            style={{ fontSize: size * 0.35 }}
          >
            HIGH CALIBER
          </span>
          <span
            className="font-azonix tracking-[0.25em] uppercase mt-0.5"
            style={{ fontSize: size * 0.25, color: accent }}
          >
            GAMING
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <HCGMark size={size} variant={variant} />
      <div className="flex flex-col items-center leading-none">
        <span
          className="font-azonix tracking-widest uppercase text-white"
          style={{ fontSize: size * 0.28 }}
        >
          HIGH CALIBER
        </span>
        <span
          className="font-azonix tracking-[0.25em] uppercase mt-0.5"
          style={{ fontSize: size * 0.22, color: accent }}
        >
          GAMING
        </span>
      </div>
    </div>
  );
}

export default HCGLogo;
