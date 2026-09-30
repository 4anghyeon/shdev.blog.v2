import * as THREE from "three";
import {
  nacreFragmentShader,
  nacreVertexShader,
} from "#/features/glass-effect/lib/nacre-shader";

const MAX_PIXEL_RATIO = 2;
const BORDER_RADIUS_PX = 32;

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
