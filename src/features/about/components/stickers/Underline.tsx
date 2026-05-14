import { motion } from "motion/react";
import { useId } from "react";
import type { SvgProps } from "#/shared/types/svg.ts";

export function Underline({ className, width = 240, height = 24 }: SvgProps) {
  const clipId = useId();

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 240 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>underline</title>
      <defs>
        <clipPath id={clipId}>
          <motion.rect
            x="0"
            y="0"
            height="24"
            initial={{ width: 0 }}
            animate={{ width }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <path
          d="M6 16C42 12 86 10 128 11C166 12 198 13 232 11"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.96"
        />
        <path
          d="M10 17C48 14 92 13 132 14C170 15 204 15 228 14"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.18"
        />
      </g>
    </svg>
  );
}
