import { motion } from "motion/react";

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

export function SkyHeader() {
  return (
    <>
      <div className="mask-alpha mask-b-from-black mask-b-from-50% mask-b-to-transparent sticky top-16 z-3 h-10 w-full bg-linear-to-b from-cyan-100/60 via-cyan-100/30 to-cyan-100/10 dark:from-gray-200/60 dark:via-gray-200/30 dark:to-gray-100/10" />
      <div className="fixed -top-10 z-5">
        {CLOUDS.map((cloud, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <not important>
          <Cloud key={i} config={cloud} />
        ))}
      </div>
    </>
  );
}
