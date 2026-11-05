import { random } from "es-toolkit";
import { motion, useAnimationFrame, useMotionValue } from "motion/react";
import {
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { BugShape } from "#/features/bug-hunt/components/BugShape";
import {
  BUG_SPECIES,
  pickSpecies,
} from "#/features/bug-hunt/helper/bug-species";
import {
  ESCAPE_SPEED_PX_PER_S,
  type FlightState,
  isOffscreen,
  type Point,
  pickOffscreenPoint,
  pickWaypoint,
  stepFlight,
} from "#/features/bug-hunt/helper/flight-path";

const LIFETIME_MS = 18_000;
const WAYPOINT_INTERVAL_RANGE_MS: [number, number] = [1200, 2600];
const WAYPOINT_REACHED_PX = 30;
const REST_PROBABILITY = 0.45;
const REST_DURATION_RANGE_MS: [number, number] = [900, 1800];
const MAX_FRAME_DELTA_MS = 50;
const CLICK_GUARD_MS = 350;

interface BugProps {
  onCatch: (point: Point) => void;
  onDone: () => void;
}

/**
 * 무작위 종류로 화면 밖에서 날아 들어와 돌아다니다가, 잡히지 않으면 일정 시간 뒤 화면 밖으로 도망가는 날벌레.
 * 잡혔거나 도망쳐서 더 이상 화면에 둘 필요가 없으면 `onDone`을 부른다.
 */
export function Bug({ onCatch, onDone }: BugProps) {
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
  const releaseTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [isCaught, setIsCaught] = useState(false);
  const [species] = useState(pickSpecies);

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
          : BUG_SPECIES[species].wanderSpeed,
        pointer: isEscapingRef.current ? null : pointerRef.current,
      },
    );
    flightRef.current = next;

    if (isEscapingRef.current && isOffscreen(next.position, viewport)) {
      isDoneRef.current = true;
      onDone();
      return;
    }

    x.set(next.position.x);
    y.set(next.position.y);
    rotate.set(
      (Math.atan2(next.velocity.y, next.velocity.x) * 180) / Math.PI + 90,
    );
  });

  const handlePointerDown = (event: ReactPointerEvent) => {
    if (isDoneRef.current) return;
    event.preventDefault();
    isDoneRef.current = true;
    setIsCaught(true);
    onCatch({ x: x.get(), y: y.get() });

    // 터치는 손가락을 뗀 뒤에 click이 따로 오므로, 그때까지 빈 터치 영역을 남겨 뒤에 있는 링크가 click을 받지 않게 한다
    const release = () => {
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      releaseTimerRef.current = setTimeout(onDone, CLICK_GUARD_MS);
    };
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
  };

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      pointerRef.current = { x: event.clientX, y: event.clientY };
    };
    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  useEffect(() => () => clearTimeout(releaseTimerRef.current), []);

  return (
    <motion.button
      type="button"
      tabIndex={-1}
      aria-label="날벌레 잡기"
      className="pointer-events-auto absolute -top-8 -left-8 flex size-16 cursor-crosshair touch-none items-center justify-center"
      style={{ x, y }}
      onPointerDown={handlePointerDown}
    >
      {!isCaught && (
        <motion.div className="text-ink-strong" style={{ rotate }}>
          <BugShape species={species} />
        </motion.div>
      )}
    </motion.button>
  );
}
