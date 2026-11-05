import { random } from "es-toolkit";
import { motion } from "motion/react";
import type { Point } from "#/features/bug-hunt/helper/flight-path";

const PARTICLE_COUNT = 7;
const PARTICLE_DISTANCE_RANGE_PX: [number, number] = [14, 30];

const particles = Array.from({ length: PARTICLE_COUNT }, (_, index) => {
  const angle = (index / PARTICLE_COUNT) * Math.PI * 2 + random(0.6);
  const distance = random(...PARTICLE_DISTANCE_RANGE_PX);
  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
    size: random(2, 4.5),
  };
});

/** 날벌레를 잡은 자리에 납작해진 얼룩과 튀는 파편을 잠깐 남긴다. */
export function Splat({ point }: { point: Point }) {
  return (
    <motion.div
      className="absolute top-0 left-0 text-ink-strong"
      style={{ x: point.x, y: point.y }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 1.4, duration: 0.8 }}
    >
      <motion.svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        className="absolute -top-3.5 -left-3.5"
        initial={{ scale: 0.2, rotate: random(360) }}
        animate={{ scale: [0.2, 1.25, 1] }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        aria-hidden="true"
      >
        <path
          d="M14 4c2 0 2.5 3 4.5 3.5S23 6 24 8.5s-2 3.5-1.5 5.5 3 3.5 1.5 5.5-4-.5-5.5 1-1.5 4-4.5 4-3-3-4.5-3.5S5 22 4 19.5s2-3 1.5-5S3 10 4.5 8.5s4 0 5.5-1.5S12 4 14 4Z"
          className="fill-current opacity-70"
        />
      </motion.svg>
      {particles.map((particle, index) => (
        <motion.span
          // biome-ignore lint/suspicious/noArrayIndexKey: 파편은 개수와 순서가 고정이다
          key={index}
          className="absolute rounded-full bg-current"
          style={{
            width: particle.size,
            height: particle.size,
            top: -particle.size / 2,
            left: -particle.size / 2,
          }}
          initial={{ x: 0, y: 0, opacity: 1 }}
          animate={{ x: particle.x, y: particle.y, opacity: 0.6 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      ))}
    </motion.div>
  );
}
