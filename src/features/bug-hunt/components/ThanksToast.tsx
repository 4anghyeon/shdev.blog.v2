import { clamp } from "es-toolkit";
import { motion } from "motion/react";
import type { Point } from "#/features/bug-hunt/helper/flight-path";

const EDGE_PADDING_PX = 120;

interface ThanksToastProps {
  point: Point;
  message: string;
  onDone: () => void;
}

/** 잡은 자리 위로 감사 메시지를 손글씨로 띄웠다가 사라지게 한다. */
export function ThanksToast({ point, message, onDone }: ThanksToastProps) {
  const x = clamp(
    point.x,
    EDGE_PADDING_PX,
    window.innerWidth - EDGE_PADDING_PX,
  );

  return (
    <motion.p
      role="status"
      className="absolute top-0 left-0 -translate-x-1/2 whitespace-nowrap font-dokdo text-3xl text-seal [text-shadow:0_0_4px_var(--background),0_0_10px_var(--background),0_0_18px_var(--background)]"
      style={{ left: x, top: point.y - 24 }}
      initial={{ opacity: 0, y: 8, scale: 0.9 }}
      animate={{
        opacity: [0, 1, 1, 0],
        y: [8, -12, -20, -36],
        scale: [0.9, 1.05, 1, 1],
      }}
      transition={{ duration: 2.4, times: [0, 0.15, 0.75, 1] }}
      onAnimationComplete={onDone}
    >
      {message}
    </motion.p>
  );
}
