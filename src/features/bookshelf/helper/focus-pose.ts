import {
  type Camera,
  Euler,
  MathUtils,
  PerspectiveCamera,
  Quaternion,
  Vector3,
} from "three";
import type { BookDimensions } from "#/features/bookshelf/helper/book-dimensions";
import { getFocusArea } from "#/features/bookshelf/helper/screen-area";
import { SHELF_DEPTH } from "#/features/bookshelf/helper/shelf-layout";

const FILL_RATIO = 0.68;
const SHELF_CLEARANCE = 4;
const MIN_DISTANCE = 10;

const FACE_CAMERA = new Quaternion().setFromEuler(
  new Euler(0.04, -Math.PI / 2 + 0.38, 0),
);
const offset = new Vector3();
const sway = new Quaternion();
const swayEuler = new Euler();

interface ViewportSize {
  width: number;
  height: number;
}

/**
 * 꺼낸 책이 패널에 가리지 않는 빈 영역 한가운데에 표지가 보이도록
 * 카메라 기준 위치와 회전을 계산하고, 그때 적용할 배율을 반환한다.
 */
export const getFocusPose = (
  camera: Camera,
  size: ViewportSize,
  dimensions: BookDimensions,
  elapsed: number,
  outPosition: Vector3,
  outQuaternion: Quaternion,
) => {
  const fov = camera instanceof PerspectiveCamera ? camera.fov : 32;
  const aspect = size.width / size.height;
  const viewHeightPerDistance = 2 * Math.tan(MathUtils.degToRad(fov) / 2);
  const viewWidthPerDistance = viewHeightPerDistance * aspect;
  const area = getFocusArea(size);

  const idealDistance = Math.max(
    dimensions.height /
      (FILL_RATIO * (area.height / size.height) * viewHeightPerDistance),
    dimensions.depth /
      (FILL_RATIO * (area.width / size.width) * viewWidthPerDistance),
  );
  // 책장이 카메라에 가까운 좁은 화면에서는 원하는 크기로 보이는 거리가 책장 뒤가 될 수 있다.
  // 이때는 책장 앞에 두고 크기를 줄여 같은 크기로 보이게 한다.
  const maxDistance = Math.max(
    MIN_DISTANCE,
    camera.position.z -
      SHELF_DEPTH / 2 -
      dimensions.depth / 2 -
      SHELF_CLEARANCE,
  );
  const distance = Math.min(idealDistance, maxDistance);

  offset.set(
    (area.centerX / size.width - 0.5) * viewWidthPerDistance * distance,
    (0.5 - area.centerY / size.height) * viewHeightPerDistance * distance,
    -distance,
  );
  outPosition
    .copy(offset.applyQuaternion(camera.quaternion))
    .add(camera.position);

  swayEuler.set(
    Math.sin(elapsed * 0.9) * 0.025,
    Math.sin(elapsed * 0.6) * 0.06,
    0,
  );
  sway.setFromEuler(swayEuler);
  outQuaternion.copy(camera.quaternion).multiply(FACE_CAMERA).multiply(sway);

  return distance / idealDistance;
};
