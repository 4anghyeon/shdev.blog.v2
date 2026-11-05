import { random } from "es-toolkit";
import { motion, useAnimationFrame, useMotionValue } from "motion/react";
import { useEffect, useRef } from "react";
import {
  ESCAPE_SPEED_PX_PER_S,
  type FlightState,
  isOffscreen,
  type Point,
  pickOffscreenPoint,
  pickWaypoint,
  stepFlight,
  WANDER_SPEED_PX_PER_S,
} from "#/features/bug-hunt/helper/flight-path";

const LIFETIME_MS = 18_000;
const WAYPOINT_INTERVAL_RANGE_MS: [number, number] = [1200, 2600];
const WAYPOINT_REACHED_PX = 30;
const REST_PROBABILITY = 0.45;
const REST_DURATION_RANGE_MS: [number, number] = [900, 1800];
const MAX_FRAME_DELTA_MS = 50;

interface BugProps {
  onCatch: (point: Point) => void;
  onEscape: () => void;
}

/** 화면 밖에서 날아 들어와 돌아다니다가, 잡히지 않으면 일정 시간 뒤 화면 밖으로 도망가는 날벌레. */
export function Bug({ onCatch, onEscape }: BugProps) {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rotate = useMotionValue(0);

  const flightRef = useRef<FlightState | null>(null);
  const targetRef = useRef<Point>({ x: 0, y: 0 });
  const bornAtRef = useRef(0);
  const waypointAtRef = useRef(0);
  const restUntilRef = useRef(0);
  const pointerRef = useRef<Point | null>(null);
  const isEscapingRef = useRef(false);
  const isDoneRef = useRef(false);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      pointerRef.current = { x: event.clientX, y: event.clientY };
    };
    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  useAnimationFrame((time, delta) => {
    if (isDoneRef.current) return;

    const viewport = { width: window.innerWidth, height: window.innerHeight };

    if (!flightRef.current) {
      flightRef.current = {
        position: pickOffscreenPoint(viewport),
        velocity: { x: 0, y: 0 },
      };
      targetRef.current = pickWaypoint(viewport);
      bornAtRef.current = time;
      waypointAtRef.current = time + random(...WAYPOINT_INTERVAL_RANGE_MS);
    }

    const flight = flightRef.current;
    if (time < restUntilRef.current) return;

    if (!isEscapingRef.current && time - bornAtRef.current > LIFETIME_MS) {
      isEscapingRef.current = true;
      targetRef.current = pickOffscreenPoint(viewport);
    } else if (!isEscapingRef.current) {
      const target = targetRef.current;
      const isReached =
        Math.hypot(target.x - flight.position.x, target.y - flight.position.y) <
        WAYPOINT_REACHED_PX;
      if (isReached || time > waypointAtRef.current) {
        targetRef.current = pickWaypoint(viewport);
        waypointAtRef.current = time + random(...WAYPOINT_INTERVAL_RANGE_MS);
        if (isReached && Math.random() < REST_PROBABILITY) {
          restUntilRef.current = time + random(...REST_DURATION_RANGE_MS);
          flightRef.current = { ...flight, velocity: { x: 0, y: 0 } };
          return;
        }
      }
    }

    const next = stepFlight(
      flight,
      targetRef.current,
      Math.min(delta, MAX_FRAME_DELTA_MS) / 1000,
      {
        speed: isEscapingRef.current
          ? ESCAPE_SPEED_PX_PER_S
          : WANDER_SPEED_PX_PER_S,
        pointer: isEscapingRef.current ? null : pointerRef.current,
      },
    );
    flightRef.current = next;

    if (isEscapingRef.current && isOffscreen(next.position, viewport)) {
      isDoneRef.current = true;
      onEscape();
      return;
    }

    x.set(next.position.x);
    y.set(next.position.y);
    rotate.set(
      (Math.atan2(next.velocity.y, next.velocity.x) * 180) / Math.PI + 90,
    );
  });

  const handlePointerDown = () => {
    if (isDoneRef.current) return;
    isDoneRef.current = true;
    onCatch({ x: x.get(), y: y.get() });
  };

  return (
    <motion.button
      type="button"
      tabIndex={-1}
      aria-label="날벌레 잡기"
      className="pointer-events-auto absolute -top-8 -left-8 flex size-16 cursor-crosshair items-center justify-center"
      style={{ x, y }}
      onPointerDown={handlePointerDown}
    >
      <motion.div className="text-ink-strong" style={{ rotate }}>
        <BugShape />
      </motion.div>
    </motion.button>
  );
}

function BugShape() {
  return (
    <svg width="26" height="26" viewBox="0 0 20 20" aria-hidden="true">
      <motion.g
        style={{ originX: "10px", originY: "10px" }}
        animate={{ scaleX: [1, 0.35] }}
        transition={{
          duration: 0.04,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "mirror",
        }}
      >
        <ellipse
          cx="5.5"
          cy="9"
          rx="4.5"
          ry="2.5"
          className="fill-ink-muted/50"
        />
        <ellipse
          cx="14.5"
          cy="9"
          rx="4.5"
          ry="2.5"
          className="fill-ink-muted/50"
        />
      </motion.g>
      <ellipse cx="10" cy="11.5" rx="2.6" ry="4.5" className="fill-current" />
      <circle cx="10" cy="6" r="2" className="fill-current" />
    </svg>
  );
}
