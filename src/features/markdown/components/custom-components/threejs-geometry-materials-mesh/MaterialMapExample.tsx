import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// 텍스처 로딩 함수는 동일
const loadTextures = (path: string) => {
  const loader = new THREE.TextureLoader();
  return {
    color: loader.load(`${path}/hangyodon.avif`),
    normal: loader.load(`${path}/hangyodon.avif`),
    roughness: loader.load(`${path}/hangyodon.avif`),
    ao: loader.load(`${path}/hangyodon.avif`),
    height: loader.load(`${path}/hangyodon.avif`),
  };
};

// Material 생성 함수는 동일
const createMaterial = (textures: any, type: string) => {
  switch (type) {
    case "map":
      return new THREE.MeshStandardMaterial({
        map: textures.color,
        side: THREE.DoubleSide,
      });
    case "normalMap":
      return new THREE.MeshStandardMaterial({
        normalMap: textures.color,
        normalScale: new THREE.Vector2(1, 1),
      });
    case "roughnessMap":
      return new THREE.MeshStandardMaterial({
        roughnessMap: textures.color,
        roughness: 1.0,
      });
    default:
      return new THREE.MeshBasicMaterial({ color: 0xff0000 });
  }
};

// 개별 도형을 위한 컴포넌트
const Shape3D = ({ materialType }: { materialType: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const requestRef = useRef<number>(0);
  const controlsRef = useRef<OrbitControls | null>(null);
  const texturesRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 이전 렌더러 정리
    if (rendererRef.current) {
      rendererRef.current.dispose();
      rendererRef.current.forceContextLoss();

      rendererRef.current = null;
    }
    if (containerRef.current) {
      const oldCanvas = containerRef.current.querySelector("canvas");
      if (oldCanvas) {
        containerRef.current.removeChild(oldCanvas);
      }
    }

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf0f0f0);

    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientWidth,
    );
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 조명 설정
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Controls 설정
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controlsRef.current = controls;

    // 텍스처 로드 및 Material 생성
    const textures = loadTextures("/images/example");
    texturesRef.current = textures;
    const material = createMaterial(textures, materialType);

    // 지오메트리 생성
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    geometry.setAttribute(
      "uv2",
      new THREE.BufferAttribute(geometry.attributes.uv.array, 2),
    );

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let isDisposed = false;

    // Animation loop
    const animate = () => {
      if (isDisposed) return;

      requestRef.current = requestAnimationFrame(animate);
      mesh.rotation.y += 0.005;
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current || !renderer) return;
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientWidth,
      );
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      isDisposed = true;

      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }

      if (controlsRef.current) {
        controlsRef.current.dispose();
        controlsRef.current = null;
      }

      // 텍스처 정리
      if (texturesRef.current) {
        Object.values(texturesRef.current).forEach((texture: any) => {
          if (texture?.dispose) {
            texture.dispose();
          }
        });
        texturesRef.current = null;
      }

      // 지오메트리와 재질 정리
      if (geometry) geometry.dispose();
      if (material) material.dispose();

      // Scene의 모든 객체 정리
      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            if (object.geometry) object.geometry.dispose();
            if (Array.isArray(object.material)) {
              // biome-ignore lint/suspicious/useIterableCallbackReturn: <>
              object.material.forEach((mat) => mat.dispose());
            } else if (object.material) {
              object.material.dispose();
            }
          }
        });
        sceneRef.current = null;
      }

      // 렌더러 정리
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current.forceContextLoss();
        rendererRef.current = null;
      }

      window.removeEventListener("resize", handleResize);
    };
  }, [materialType]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="h-full w-full" ref={containerRef} />
      <p className="mt-2 text-center font-semibold text-sm">{`Mesh${materialType}`}</p>
    </div>
  );
};

// 메인 컴포넌트는 동일
export const MaterialMapExample = () => {
  const materials = ["map", "normalMap", "roughnessMap"];

  return (
    <div className="container mx-auto p-1">
      <div className="grid grid-cols-1 gap-1 sm:grid-cols-3 md:gap-4">
        {materials.map((type) => (
          <div key={type} className="aspect-square p-1 md:p-4">
            <Shape3D materialType={type} />
          </div>
        ))}
      </div>
    </div>
  );
};
