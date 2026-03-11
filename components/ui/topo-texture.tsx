import { cn } from "@/lib/utils";

interface TopoTextureProps {
  className?: string;
  /** Color of the contour lines — defaults to hcg-blue */
  color?: string;
  /** Overall opacity multiplier 0–1 */
  opacity?: number;
  /** Variant: 'mountain' (classic peak) | 'ridge' (horizontal bands) | 'dual' (two peaks) */
  variant?: "mountain" | "ridge" | "dual";
}

/**
 * Topographic map texture overlay.
 * Place this as an absolute-positioned sibling inside a relative container.
 */
export function TopoTexture({
  className,
  color = "#00B4FF",
  opacity = 1,
  variant = "mountain",
}: TopoTextureProps) {
  return (
    <svg
      className={cn("pointer-events-none select-none", className)}
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {variant === "mountain" && <MountainContours color={color} opacity={opacity} />}
      {variant === "ridge" && <RidgeContours color={color} opacity={opacity} />}
      {variant === "dual" && (
        <>
          <MountainContours color={color} opacity={opacity} />
          <SecondPeak color={color} opacity={opacity} />
        </>
      )}
    </svg>
  );
}

/* ── Mountain Peak ─────────────────────────────────────────────────── */

function MountainContours({ color, opacity }: { color: string; opacity: number }) {
  // Concentric rings converging to peak at ~(900, 160) on 1440×900
  const rings = [
    {
      // Ring 1 — outermost / lowest elevation
      d: "M 900,18 C 1120,6 1400,58 1440,240 S 1420,520 1250,680 S 1000,790 760,796 S 380,792 180,690 S -10,540 2,310 S 100,72 380,24 S 620,18 900,18 Z",
      op: 0.025,
    },
    {
      d: "M 900,64 C 1080,54 1330,100 1390,258 S 1370,510 1210,654 S 978,752 752,756 S 400,748 212,654 S 34,514 38,322 S 132,108 390,68 S 660,66 900,64 Z",
      op: 0.033,
    },
    {
      d: "M 900,110 C 1040,102 1260,142 1340,276 S 1320,498 1170,626 S 956,714 744,716 S 420,704 244,618 S 76,488 74,334 S 164,144 400,112 S 700,114 900,110 Z",
      op: 0.041,
    },
    {
      d: "M 900,156 C 1000,150 1190,184 1290,294 S 1270,486 1130,598 S 934,676 736,676 S 440,660 276,582 S 118,462 110,346 S 196,180 410,156 S 740,162 900,156 Z",
      op: 0.048,
    },
    {
      d: "M 900,202 C 960,198 1120,226 1240,312 S 1220,474 1090,570 S 912,638 728,636 S 460,616 308,546 S 160,436 146,358 S 228,216 420,200 S 780,210 900,202 Z",
      op: 0.055,
    },
    {
      d: "M 900,248 C 934,246 1050,268 1190,330 S 1170,462 1050,542 S 890,600 720,596 S 480,572 340,510 S 202,410 182,370 S 260,252 430,244 S 820,258 900,248 Z",
      op: 0.062,
    },
    {
      d: "M 900,294 C 916,294 1000,308 1140,352 S 1120,448 1010,516 S 868,562 712,556 S 500,528 372,474 S 244,384 218,382 S 292,288 440,288 S 860,298 900,294 Z",
      op: 0.068,
    },
    {
      d: "M 900,336 C 908,338 966,348 1090,374 S 1070,436 970,490 S 846,524 704,516 S 520,484 404,438 S 284,358 254,394 S 322,322 450,330 S 866,338 900,336 Z",
      op: 0.074,
    },
    {
      d: "M 900,374 C 904,376 942,384 1042,400 S 1022,424 930,466 S 822,484 696,474 S 536,440 432,400 S 320,330 292,360 S 354,310 464,370 S 872,378 900,374 Z",
      op: 0.08,
    },
    {
      // Innermost — near the peak
      d: "M 900,406 C 902,408 920,418 994,424 S 974,410 882,442 S 796,444 688,432 S 552,396 462,364 S 358,308 346,344 S 396,312 486,406 S 876,418 900,406 Z",
      op: 0.086,
    },
  ];

  return (
    <g>
      {rings.map((ring, i) => (
        <path
          key={i}
          d={ring.d}
          stroke={color}
          strokeWidth="1.2"
          opacity={ring.op * opacity}
          fill="none"
          strokeLinejoin="round"
        />
      ))}
    </g>
  );
}

/* ── Horizontal Ridge bands ─────────────────────────────────────────── */

function RidgeContours({ color, opacity }: { color: string; opacity: number }) {
  const bands = [
    { y: 780, d: "M -40,780 C 180,758 480,792 800,772 S 1220,754 1480,774", op: 0.03 },
    { y: 720, d: "M 0,720 C 200,696 500,724 820,704 S 1200,688 1440,710", op: 0.038 },
    { y: 660, d: "M 40,660 C 230,634 520,658 840,638 S 1180,624 1400,642", op: 0.045 },
    { y: 600, d: "M 120,600 C 300,572 560,594 860,576 S 1140,562 1320,578", op: 0.052 },
    { y: 540, d: "M 200,540 C 360,510 600,528 880,512 S 1120,498 1260,514", op: 0.06 },
    { y: 480, d: "M 300,480 C 440,448 660,462 900,448 S 1100,434 1200,448", op: 0.068 },
    { y: 420, d: "M 400,420 C 520,388 720,396 920,384 S 1080,370 1140,382", op: 0.076 },
    { y: 360, d: "M 490,360 C 594,328 774,330 940,320 S 1060,306 1100,318", op: 0.084 },
    { y: 300, d: "M 570,300 C 658,268 814,262 960,256 S 1040,242 1070,254", op: 0.09 },
    { y: 240, d: "M 630,240 C 702,208 838,200 970,196 S 1020,184 1042,194", op: 0.094 },
    { y: 180, d: "M 670,180 C 730,148 848,138 968,136 S 1006,126 1024,134", op: 0.098 },
    { y: 120, d: "M 700,120 C 750,90 854,78 966,78 S 996,70 1010,76", op: 0.1 },
  ];

  return (
    <g>
      {bands.map((b, i) => (
        <path
          key={i}
          d={b.d}
          stroke={color}
          strokeWidth="1.2"
          opacity={b.op * opacity}
          fill="none"
          strokeLinecap="round"
        />
      ))}
    </g>
  );
}

/* ── Second peak (used in dual variant) ────────────────────────────── */

function SecondPeak({ color, opacity }: { color: string; opacity: number }) {
  const rings = [
    {
      d: "M 280,400 C 380,380 520,390 580,450 S 580,540 480,590 S 320,610 200,570 S 60,500 60,430 S 120,370 280,400 Z",
      op: 0.03,
    },
    {
      d: "M 280,430 C 360,412 480,420 540,470 S 538,540 450,580 S 310,596 200,562 S 80,500 82,440 S 144,402 280,430 Z",
      op: 0.042,
    },
    {
      d: "M 280,460 C 344,444 444,450 500,490 S 496,538 420,570 S 300,582 210,554 S 104,498 104,450 S 168,436 280,460 Z",
      op: 0.055,
    },
    {
      d: "M 280,490 C 330,476 408,480 460,510 S 454,536 390,560 S 290,568 220,546 S 128,496 126,458 S 192,468 280,490 Z",
      op: 0.067,
    },
  ];

  return (
    <g>
      {rings.map((ring, i) => (
        <path
          key={i}
          d={ring.d}
          stroke={color}
          strokeWidth="1.2"
          opacity={ring.op * opacity}
          fill="none"
        />
      ))}
    </g>
  );
}

export default TopoTexture;
