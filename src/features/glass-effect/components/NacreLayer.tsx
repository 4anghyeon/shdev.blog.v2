import { useEffect, useRef } from "react";
import glass from "#/features/glass-effect/glass-effect.module.css";
import {
  createNacreScene,
  type NacreScene,
} from "#/features/glass-effect/helper/nacre-scene";
import { useTheme } from "#/features/theme/provider/ThemeProvider";

export function NacreLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<NacreScene | null>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = createNacreScene(canvas);
    sceneRef.current = scene;
    return () => {
      scene.dispose();
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    sceneRef.current?.setDark(isDark);
  }, [isDark]);

  return <canvas ref={canvasRef} className={glass.nacre} aria-hidden />;
}
