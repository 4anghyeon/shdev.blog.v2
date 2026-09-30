import { useEffect, useRef } from "react";
import { NacreRenderer } from "#/features/glass-effect/lib/nacre-renderer";

export function NacreLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let nacre: NacreRenderer;
    try {
      nacre = new NacreRenderer(canvas);
    } catch {
      return;
    }

    const resizeObserver = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      nacre.setSize(width, height);
    });
    resizeObserver.observe(canvas);

    let frameId = 0;
    const loop = (time: number) => {
      nacre.render(time / 1000);
      frameId = requestAnimationFrame(loop);
    };
    frameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      nacre.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="glass-nacre" aria-hidden />;
}
