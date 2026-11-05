import { random, randomInt } from "es-toolkit";

export interface Point {
  x: number;
  y: number;
}

export interface Viewport {
  width: number;
  height: number;
}

export interface FlightState {
  position: Point;
  velocity: Point;
}

interface StepOptions {
  speed: number;
  pointer: Point | null;
}

const OFFSCREEN_MARGIN_PX = 40;
const WAYPOINT_MARGIN_PX = 48;
const STEER_RATE = 3;
const JITTER_ACCEL = 1200;
const FLEE_RADIUS_PX = 70;
const FLEE_ACCEL = 800;

export const WANDER_SPEED_PX_PER_S = 110;
export const ESCAPE_SPEED_PX_PER_S = 360;

/** 화면 네 가장자리 중 하나의 바깥쪽에서 무작위 지점을 고른다. */
export const pickOffscreenPoint = ({ width, height }: Viewport): Point => {
  const side = randomInt(0, 4);
  switch (side) {
    case 0:
      return { x: random(width), y: -OFFSCREEN_MARGIN_PX };
    case 1:
      return { x: width + OFFSCREEN_MARGIN_PX, y: random(height) };
    case 2:
      return { x: random(width), y: height + OFFSCREEN_MARGIN_PX };
    default:
      return { x: -OFFSCREEN_MARGIN_PX, y: random(height) };
  }
};

/** 화면 안쪽에서 다음 목적지를 무작위로 고른다. */
export const pickWaypoint = ({ width, height }: Viewport): Point => ({
  x: random(WAYPOINT_MARGIN_PX, width - WAYPOINT_MARGIN_PX),
  y: random(WAYPOINT_MARGIN_PX, height - WAYPOINT_MARGIN_PX),
});

/** 지점이 화면 밖으로 완전히 벗어났는지 확인한다. */
export const isOffscreen = ({ x, y }: Point, { width, height }: Viewport) =>
  x < -OFFSCREEN_MARGIN_PX ||
  y < -OFFSCREEN_MARGIN_PX ||
  x > width + OFFSCREEN_MARGIN_PX ||
  y > height + OFFSCREEN_MARGIN_PX;

/**
 * 목적지 쪽으로 방향을 틀면서 날벌레 특유의 떨림과 커서 회피를 더해 `dtSec` 뒤의 비행 상태를 계산한다.
 */
export const stepFlight = (
  { position, velocity }: FlightState,
  target: Point,
  dtSec: number,
  { speed, pointer }: StepOptions,
): FlightState => {
  const dx = target.x - position.x;
  const dy = target.y - position.y;
  const distance = Math.hypot(dx, dy) || 1;

  const steer = 1 - Math.exp(-STEER_RATE * dtSec);
  let vx = velocity.x + ((dx / distance) * speed - velocity.x) * steer;
  let vy = velocity.y + ((dy / distance) * speed - velocity.y) * steer;

  vx += (Math.random() - 0.5) * JITTER_ACCEL * dtSec;
  vy += (Math.random() - 0.5) * JITTER_ACCEL * dtSec;

  if (pointer) {
    const px = position.x - pointer.x;
    const py = position.y - pointer.y;
    const pointerDistance = Math.hypot(px, py) || 1;
    if (pointerDistance < FLEE_RADIUS_PX) {
      const strength = 1 - pointerDistance / FLEE_RADIUS_PX;
      vx += (px / pointerDistance) * FLEE_ACCEL * strength * dtSec;
      vy += (py / pointerDistance) * FLEE_ACCEL * strength * dtSec;
    }
  }

  return {
    position: { x: position.x + vx * dtSec, y: position.y + vy * dtSec },
    velocity: { x: vx, y: vy },
  };
};
