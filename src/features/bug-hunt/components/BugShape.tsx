import { motion } from "motion/react";
import type { ComponentType } from "react";
import type { BugSpecies } from "#/features/bug-hunt/helper/bug-species";

const SHAPES = {
  fly: FlyShape,
  ladybug: LadybugShape,
  mosquito: MosquitoShape,
} satisfies Record<BugSpecies, ComponentType>;

/** 벌레 종류에 맞는 모양을 머리가 위쪽을 향하도록 그린다. */
export function BugShape({ species }: { species: BugSpecies }) {
  const Shape = SHAPES[species];
  return (
    <svg width="26" height="26" viewBox="0 0 20 20" aria-hidden="true">
      <Shape />
    </svg>
  );
}

interface WingsProps {
  cy: number;
  rx: number;
  ry: number;
  spread: number;
  tilt?: number;
}

/** 몸통 중심(x=10)을 기준으로 좌우 대칭인 날개 한 쌍을 빠르게 파닥이게 한다. */
function Wings({ cy, rx, ry, spread, tilt = 0 }: WingsProps) {
  return (
    <motion.g
      style={{ originX: "10px", originY: `${cy}px` }}
      animate={{ scaleX: [1, 0.35] }}
      transition={{
        duration: 0.04,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "mirror",
      }}
    >
      {[-1, 1].map((side) => (
        <ellipse
          key={side}
          cx={10 + side * spread}
          cy={cy}
          rx={rx}
          ry={ry}
          transform={`rotate(${side * tilt} ${10 + side * spread} ${cy})`}
          className="fill-ink-muted/50"
        />
      ))}
    </motion.g>
  );
}

function FlyShape() {
  return (
    <>
      <Wings cy={9} rx={4.5} ry={2.5} spread={4.5} />
      <ellipse cx="10" cy="11.5" rx="2.6" ry="4.5" className="fill-current" />
      <circle cx="10" cy="6" r="2" className="fill-current" />
    </>
  );
}

function LadybugShape() {
  return (
    <>
      <Wings cy={11} rx={4} ry={2.2} spread={5.5} tilt={20} />
      <circle cx="10" cy="5.2" r="2.2" className="fill-stone-900" />
      <circle cx="10" cy="11.5" r="5.2" className="fill-red-600" />
      <line
        x1="10"
        y1="6.5"
        x2="10"
        y2="16.7"
        strokeWidth="0.7"
        className="stroke-stone-900"
      />
      {[
        [7.6, 9.6, 1],
        [12.4, 9.6, 1],
        [7.4, 13.4, 1.1],
        [12.6, 13.4, 1.1],
      ].map(([cx, cy, r]) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r={r}
          className="fill-stone-900"
        />
      ))}
    </>
  );
}

function MosquitoShape() {
  return (
    <>
      {[
        [8.8, 9, 4.5, 6.5],
        [8.8, 11, 3.5, 12],
        [9, 13, 5, 17],
      ].flatMap(([x1, y1, x2, y2]) =>
        [-1, 1].map((side) => (
          <line
            key={`${y1}-${side}`}
            x1={10 + side * (10 - x1)}
            y1={y1}
            x2={10 + side * (10 - x2)}
            y2={y2}
            strokeWidth="0.5"
            className="stroke-current"
          />
        )),
      )}
      <Wings cy={9.5} rx={3.8} ry={1.4} spread={3.8} tilt={-15} />
      <line
        x1="10"
        y1="4"
        x2="10"
        y2="1"
        strokeWidth="0.5"
        className="stroke-current"
      />
      <ellipse cx="10" cy="12.5" rx="1.2" ry="4.5" className="fill-current" />
      <circle cx="10" cy="5.6" r="1.5" className="fill-current" />
    </>
  );
}
