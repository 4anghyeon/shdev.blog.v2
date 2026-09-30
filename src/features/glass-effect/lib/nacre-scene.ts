import {
  type BubbleRect,
  NacreRenderer,
} from "#/features/glass-effect/lib/nacre-renderer";

const FRAME_INTERVAL_MS = 1000 / 30;
const MAX_FRAME_DELTA_MS = 100;
const LIGHT_EASING = 0.08;
const LIGHT_RANGE_PX = 480;
const SCROLL_LIGHT_PERIOD_PX = 300;
const DEFAULT_LIGHT = { x: -0.4, y: 0.6 };
const HEAD_SELECTOR = '[data-glass-highlight="head"]';
const TAIL_SELECTOR = '[data-glass-highlight="tail"]';
const ACTIVE_ATTRIBUTE = "data-nacre-active";

/** WebGL 버블이 그려지는 중인 컨테이너. 이때 DOM 버블은 숨기고 위치 측정용으로만 쓴다 */
export const NACRE_ACTIVE_SELECTOR = `[${ACTIVE_ATTRIBUTE}]`;

const EMPTY_RECT: BubbleRect = { x: 0, y: 0, width: 0, height: 0 };

const isSameRect = (a: BubbleRect, b: BubbleRect) =>
  a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;

export interface NacreScene {
  setDark: (isDark: boolean) => void;
  dispose: () => void;
}

const noopScene: NacreScene = {
  setDark: () => {},
  dispose: () => {},
};

/**
 * 자개 캔버스의 렌더 루프를 관리한다.
 * - 30fps로 제한하되 버블이 움직이는 동안은 매 프레임 그리고, 화면 밖에 있으면 루프를 멈춘다
 * - prefers-reduced-motion이면 시간·포인터 애니메이션 없이 변화가 있을 때만 그린다
 * - WebGL을 쓸 수 없으면 아무것도 그리지 않는다 (투명 유리만 남는다)
 */
export function createNacreScene(canvas: HTMLCanvasElement): NacreScene {
  let nacre: NacreRenderer;
  try {
    nacre = new NacreRenderer(canvas);
  } catch {
    return noopScene;
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(pointer: fine)");
  const light = { ...DEFAULT_LIGHT };
  const targetLight = { ...DEFAULT_LIGHT };
  const container = canvas.parentElement;
  let head = EMPTY_RECT;
  let tail = EMPTY_RECT;

  let isVisible = true;
  let isContextLost = false;
  let needsRender = true;
  let frameId = 0;
  let lastFrameTime = 0;
  let elapsedSeconds = 0;

  const resize = (width: number, height: number) => {
    nacre.setSize(width, height);
    needsRender = true;
  };

  const setActive = (isActive: boolean) => {
    container?.toggleAttribute(ACTIVE_ATTRIBUTE, isActive);
  };

  const measure = (selector: string, canvasRect: DOMRect): BubbleRect => {
    const element = container?.querySelector<HTMLElement>(selector);
    if (!element || canvasRect.width === 0) return EMPTY_RECT;

    const rect = element.getBoundingClientRect();
    // 조상에 zoom/transform이 걸려 있어도 셰이더의 CSS px 좌표와 맞도록 환산한다
    const scale = canvas.clientWidth / canvasRect.width;
    return {
      x: (rect.left - canvasRect.left) * scale,
      y: (canvasRect.bottom - rect.bottom) * scale,
      width: rect.width * scale,
      height: rect.height * scale,
    };
  };

  /** 버블 위치가 바뀌었으면 true */
  const syncBubble = () => {
    const canvasRect = canvas.getBoundingClientRect();
    const nextHead = measure(HEAD_SELECTOR, canvasRect);
    const nextTail = measure(TAIL_SELECTOR, canvasRect);
    if (isSameRect(nextHead, head) && isSameRect(nextTail, tail)) return false;

    head = nextHead;
    tail = nextTail;
    nacre.setBubble(head, tail);
    needsRender = true;
    return true;
  };

  const easeLight = () => {
    light.x += (targetLight.x - light.x) * LIGHT_EASING;
    light.y += (targetLight.y - light.y) * LIGHT_EASING;
    nacre.setLight(light.x, light.y);
  };

  const tick = (now: number) => {
    frameId = 0;
    if (!isVisible) return;
    schedule();

    const isBubbleMoving = syncBubble();
    const isFrameDue = now - lastFrameTime >= FRAME_INTERVAL_MS;
    if (!isBubbleMoving && !isFrameDue) return;
    const delta = lastFrameTime === 0 ? 0 : now - lastFrameTime;
    lastFrameTime = now;

    if (!reducedMotion.matches) {
      elapsedSeconds += Math.min(delta, MAX_FRAME_DELTA_MS) / 1000;
      easeLight();
      needsRender = true;
    }

    if (!needsRender || isContextLost) return;
    nacre.render(elapsedSeconds);
    needsRender = false;
  };

  const schedule = () => {
    if (frameId === 0) frameId = requestAnimationFrame(tick);
  };

  const handlePointerMove = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    const rect = canvas.getBoundingClientRect();
    const dx = (event.clientX - (rect.left + rect.width / 2)) / LIGHT_RANGE_PX;
    // WebGL 좌표계는 y축이 위를 향한다
    const dy = (rect.top + rect.height / 2 - event.clientY) / LIGHT_RANGE_PX;
    const scale = Math.min(1, 1 / Math.hypot(dx, dy));
    targetLight.x = dx * scale;
    targetLight.y = dy * scale;
  };

  // 터치 기기에서는 포인터 대신 스크롤 위치로 빛 방향을 흔든다
  const handleScroll = () => {
    if (finePointer.matches) return;
    targetLight.x = Math.sin(window.scrollY / SCROLL_LIGHT_PERIOD_PX) * 0.6;
  };

  const handleContextLost = () => {
    isContextLost = true;
    setActive(false);
  };

  const handleContextRestored = () => {
    isContextLost = false;
    setActive(true);
    needsRender = true;
    schedule();
  };

  const handleMotionPreferenceChange = () => {
    needsRender = true;
    schedule();
  };

  const resizeObserver = new ResizeObserver(([entry]) => {
    resize(entry.contentRect.width, entry.contentRect.height);
  });
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting;
    if (isVisible) schedule();
  });

  setActive(true);
  resize(canvas.clientWidth, canvas.clientHeight);
  resizeObserver.observe(canvas);
  intersectionObserver.observe(canvas);
  window.addEventListener("pointermove", handlePointerMove, { passive: true });
  window.addEventListener("scroll", handleScroll, { passive: true });
  canvas.addEventListener("webglcontextlost", handleContextLost);
  canvas.addEventListener("webglcontextrestored", handleContextRestored);
  reducedMotion.addEventListener("change", handleMotionPreferenceChange);
  schedule();

  return {
    setDark: (isDark) => {
      nacre.setDark(isDark);
      needsRender = true;
    },
    dispose: () => {
      setActive(false);
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("scroll", handleScroll);
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);
      reducedMotion.removeEventListener("change", handleMotionPreferenceChange);
      nacre.dispose();
    },
  };
}
