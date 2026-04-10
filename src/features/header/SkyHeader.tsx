import { motion } from "motion/react";
import { useTheme } from "../theme/provider/ThemeProvider";

const SPRITE_W = 292;
const SPRITE_H = 280;

interface CloudConfig {
  spriteCol: number;
  spriteRow: number;
  topPx: number;
  className: string;
  yRange: number;
  duration: number;
  delay: number;
}

const CLOUDS: CloudConfig[] = [
  {
    spriteCol: 2,
    spriteRow: 0,
    topPx: 10,
    className: "-left-[60px] sm:left-0",
    yRange: 14,
    duration: 5,
    delay: 0,
  },
  {
    spriteCol: 0,
    spriteRow: 0,
    topPx: -15,
    className: "hidden sm:block sm:left-[400px]",
    yRange: 12,
    duration: 6,
    delay: 1,
  },
  {
    spriteCol: 2,
    spriteRow: 1,
    topPx: 10,
    className: "left-[140px] sm:left-[700px]",
    yRange: 14,
    duration: 5,
    delay: 2,
  },
  {
    spriteCol: 1,
    spriteRow: 1,
    topPx: 0,
    className: "left-[280px] sm:left-[1000px]",
    yRange: 14,
    duration: 3,
    delay: 0.3,
  },
  {
    spriteCol: 1,
    spriteRow: 0,
    topPx: 10,
    className: "left-[400px] sm:left-[1400px]",
    yRange: 8,
    duration: 4,
    delay: 0.5,
  },
];

interface StarConfig {
  top: string;
  left: string;
  size: number;
  duration: number;
  delay: number;
}

const STARS: StarConfig[] = [
  { top: "50%", left: "10%", size: 2, duration: 3, delay: 0 },
  { top: "60%", left: "25%", size: 1.5, duration: 4, delay: 2 },
  { top: "55%", left: "45%", size: 2.5, duration: 3.5, delay: 0.5 },
  { top: "65%", left: "60%", size: 1.8, duration: 4.5, delay: 1.5 },
  { top: "50%", left: "80%", size: 2.2, duration: 3.8, delay: 3 },
  { top: "70%", left: "90%", size: 1.2, duration: 5, delay: 0.2 },
  { top: "45%", left: "35%", size: 1.6, duration: 4.2, delay: 1.2 },
  { top: "68%", left: "15%", size: 2.4, duration: 3.6, delay: 0.8 },
  { top: "58%", left: "70%", size: 1.4, duration: 4.8, delay: 2.8 },
  { top: "48%", left: "55%", size: 2, duration: 3.4, delay: 0.4 },
];

function Cloud({ config }: { config: CloudConfig }) {
  const { spriteCol, spriteRow, topPx, className, yRange, duration, delay } =
    config;

  return (
    <motion.div
      className={`absolute z-5 h-42.5 w-73 scale-[0.15] bg-no-repeat ${className}`}
      style={{
        top: topPx,
        backgroundImage: "url('/images/cloud.webp')",
        backgroundPosition: `-${SPRITE_W * spriteCol}px -${SPRITE_H * spriteRow}px`,
      }}
      animate={{ y: [0, yRange, 0] }}
      transition={{
        y: { duration, repeat: Infinity, ease: "easeInOut", delay },
      }}
    />
  );
}

function Star({ config }: { config: StarConfig }) {
  const { top, left, size, duration, delay } = config;

  return (
    <motion.div
      className="absolute z-5"
      style={{
        top,
        left,
        width: size,
        height: size,
      }}
      animate={{
        opacity: [0.2, 1, 0.2],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      <div className="absolute inset-0 rounded-full bg-amber-100 shadow-[0_0_4px_2px_rgba(255,255,255,0.8)]" />
      <div className="absolute top-1/2 left-1/2 h-[300%] w-[0.5px] -translate-x-1/2 -translate-y-1/2 bg-amber-50/50" />
      <div className="absolute top-1/2 left-1/2 h-[0.5px] w-[300%] -translate-x-1/2 -translate-y-1/2 bg-amber-50/50" />
    </motion.div>
  );
}

export function SkyHeader() {
  const { isDark } = useTheme();

  return (
    <>
      <div className="mask-alpha mask-b-from-black mask-b-from-50% mask-b-to-transparent sticky top-16 z-3 h-10 w-full bg-linear-to-b from-cyan-100/60 via-cyan-100/30 to-cyan-100/10 dark:from-stone-950/40 dark:via-stone-950/30 dark:to-stone-950/10" />
      <div className="pointer-events-none fixed -top-10 z-0 h-40 w-full">
        {isDark
          ? STARS.map((star, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <not important>
              <Star key={i} config={star} />
            ))
          : CLOUDS.map((cloud, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <not important>
              <Cloud key={i} config={cloud} />
            ))}
      </div>
    </>
  );
}
