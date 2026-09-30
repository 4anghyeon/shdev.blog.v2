import * as THREE from "three";
import nacreFragmentShader from "#/features/glass-effect/lib/nacre.frag.glsl?raw";
import nacreVertexShader from "#/features/glass-effect/lib/nacre.vert.glsl?raw";

const MAX_PIXEL_RATIO = 2;
const BORDER_RADIUS_PX = 32;
const BUBBLE_RADIUS_PX = 12;

export interface BubbleRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class NacreRenderer {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.Camera();
  private readonly geometry = new THREE.PlaneGeometry(2, 2);
  private readonly material: THREE.ShaderMaterial;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
    });
    this.renderer.setClearColor(0x000000, 0);

    this.material = new THREE.ShaderMaterial({
      vertexShader: nacreVertexShader,
      fragmentShader: nacreFragmentShader,
      transparent: true,
      uniforms: {
        uResolution: { value: new THREE.Vector2(1, 1) },
        uTime: { value: 0 },
        uRadius: { value: BORDER_RADIUS_PX },
        uLight: { value: new THREE.Vector2(-0.4, 0.6) },
        uPixelRatio: { value: 1 },
        uHead: { value: new THREE.Vector4(0, 0, 0, 0) },
        uTail: { value: new THREE.Vector4(0, 0, 0, 0) },
        uBubbleRadius: { value: BUBBLE_RADIUS_PX },
        uDark: { value: 0 },
      },
    });

    this.scene.add(new THREE.Mesh(this.geometry, this.material));
  }

  setSize(width: number, height: number) {
    const pixelRatio = Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO);
    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(width, height, false);
    this.material.uniforms.uResolution.value.set(
      width * pixelRatio,
      height * pixelRatio,
    );
    this.material.uniforms.uRadius.value = BORDER_RADIUS_PX * pixelRatio;
    this.material.uniforms.uPixelRatio.value = pixelRatio;
  }

  setLight(x: number, y: number) {
    this.material.uniforms.uLight.value.set(x, y);
  }

  setBubble(head: BubbleRect, tail: BubbleRect) {
    this.material.uniforms.uHead.value.set(
      head.x,
      head.y,
      head.width,
      head.height,
    );
    this.material.uniforms.uTail.value.set(
      tail.x,
      tail.y,
      tail.width,
      tail.height,
    );
  }

  setDark(isDark: boolean) {
    this.material.uniforms.uDark.value = isDark ? 1 : 0;
  }

  render(timeSeconds: number) {
    this.material.uniforms.uTime.value = timeSeconds;
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
    this.renderer.dispose();
  }
}
