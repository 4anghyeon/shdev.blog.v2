import { random } from "es-toolkit";
import { easing } from "maath";
import { Euler, type Matrix4, Quaternion, Vector3 } from "three";
import { PETIOLE_REACH } from "#/features/bookshelf/helper/leaf";

/** 공기 저항 때문에 더 빨라지지 않는 낙하 속도(cm/s) */
const TERMINAL_SPEED = 28;
/** 떨어지기 시작해서 최고 속도에 가까워지는 데 걸리는 시간 */
const ACCELERATION_TIME = 0.35;
/** 책장 쪽으로 파고들지 않도록 앞으로 밀려나는 속도와 그 시간 */
const FORWARD_DRIFT = 4;
const FORWARD_DRIFT_TIME = 1.5;
/** 바닥에 닿은 잎이 자세를 바로잡는 시간 */
const SETTLE_TIME = 0.18;
const SETTLED_ANGLE = 0.01;

const UP = new Vector3(0, 1, 0);
const FACE_DOWN = new Quaternion().setFromAxisAngle(
  new Vector3(1, 0, 0),
  Math.PI / 2,
);

type FallPhase = "falling" | "settling" | "settled";

/** 줄기에서 떨어져 바닥까지 팔랑이며 내려가는 잎 하나의 상태. */
export interface FallingLeaf {
  phase: FallPhase;
  start: Vector3;
  restQuaternion: Quaternion;
  scale: Vector3;
  position: Vector3;
  quaternion: Quaternion;
  time: number;
  dropped: number;
  swayAmplitude: number;
  swayFrequency: number;
  swayPhase: number;
  spinSpeed: number;
  landedQuaternion: Quaternion;
}

/** 잎의 현재 변환 행렬에서 낙하를 시작한다. 흔들림의 폭과 박자는 잎마다 다르다. */
export const createFallingLeaf = (matrix: Matrix4): FallingLeaf => {
  const start = new Vector3();
  const restQuaternion = new Quaternion();
  const scale = new Vector3();
  matrix.decompose(start, restQuaternion, scale);

  return {
    phase: "falling",
    start,
    restQuaternion,
    scale,
    position: start.clone(),
    quaternion: restQuaternion.clone(),
    time: 0,
    dropped: 0,
    swayAmplitude: random(2, 4),
    swayFrequency: random(2.6, 3.6),
    swayPhase: random(0, Math.PI * 2),
    spinSpeed: random(-1.2, 1.2),
    // 접힌 잎은 뒤집혀 떨어져야 가장자리가 위로 말려 바닥에 자연스럽게 얹힌다
    landedQuaternion: new Quaternion()
      .setFromAxisAngle(UP, random(0, Math.PI * 2))
      .multiply(FACE_DOWN),
  };
};

const flutter = new Euler();
const flutterQuaternion = new Quaternion();

/**
 * 좌우로 진자처럼 흔들리며 떨어진다.
 * 흔들림의 양 끝에서는 잎이 바람을 받아 느려지고, 가운데를 지날 때 빨라진다.
 */
const stepFalling = (leaf: FallingLeaf, delta: number, floorY: number) => {
  leaf.time += delta;
  const swing = Math.sin(leaf.time * leaf.swayFrequency + leaf.swayPhase);
  const glide = Math.cos(leaf.time * leaf.swayFrequency + leaf.swayPhase);
  const speed = TERMINAL_SPEED * (1 - Math.exp(-leaf.time / ACCELERATION_TIME));
  leaf.dropped += speed * (0.45 + 0.55 * Math.abs(glide)) * delta;

  leaf.position.set(
    leaf.start.x + swing * leaf.swayAmplitude,
    leaf.start.y - leaf.dropped,
    leaf.start.z +
      FORWARD_DRIFT * Math.min(leaf.time, FORWARD_DRIFT_TIME) +
      glide * leaf.swayAmplitude * 0.3,
  );
  flutter.set(swing * 0.8, leaf.time * leaf.spinSpeed, glide * 0.5);
  leaf.quaternion
    .copy(leaf.restQuaternion)
    .multiply(flutterQuaternion.setFromEuler(flutter));

  const restY = floorY + PETIOLE_REACH * leaf.scale.y;
  if (leaf.position.y <= restY) {
    leaf.position.y = restY;
    leaf.phase = "settling";
  }
};

/** 잎을 한 프레임만큼 움직인다. 바닥에 눕고 나면 더 움직이지 않는다. */
export const stepFallingLeaf = (
  leaf: FallingLeaf,
  delta: number,
  floorY: number,
) => {
  if (leaf.phase === "falling") {
    stepFalling(leaf, delta, floorY);
    return;
  }
  if (leaf.phase === "settling") {
    easing.dampQ(leaf.quaternion, leaf.landedQuaternion, SETTLE_TIME, delta);
    if (leaf.quaternion.angleTo(leaf.landedQuaternion) < SETTLED_ANGLE) {
      leaf.quaternion.copy(leaf.landedQuaternion);
      leaf.phase = "settled";
    }
  }
};

export const composeLeafMatrix = (leaf: FallingLeaf, target: Matrix4) =>
  target.compose(leaf.position, leaf.quaternion, leaf.scale);
