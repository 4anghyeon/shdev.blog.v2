import { motion, useReducedMotion } from "motion/react";
import { cn } from "#/shared/lib/tailwind";

const LOADING_SPINES = [
  { key: "indigo", className: "h-10 bg-pigment-indigo/40" },
  { key: "seal", className: "h-12 bg-seal/35" },
  { key: "ochre", className: "h-9 bg-pigment-ochre/40" },
  { key: "celadon", className: "h-11 bg-pigment-celadon/40" },
];

/** 3D 책장을 불러오는 동안 책등이 차례로 들썩이는 로딩 표시. */
export function BookshelfLoading() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      role="status"
      exit={{ opacity: 0, transition: { duration: 0.4 } }}
      className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-y-4"
    >
      <div className="flex items-end gap-x-1">
        {LOADING_SPINES.map((spine, index) => (
          <motion.span
            key={spine.key}
            className={cn("w-3 rounded-xs", spine.className)}
            animate={shouldReduceMotion ? undefined : { y: [0, -8, 0] }}
            transition={{
              duration: 0.9,
              repeat: Number.POSITIVE_INFINITY,
              delay: index * 0.12,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <p className="text-ink-muted text-sm">책장을 정리하는 중…</p>
    </motion.div>
  );
}
