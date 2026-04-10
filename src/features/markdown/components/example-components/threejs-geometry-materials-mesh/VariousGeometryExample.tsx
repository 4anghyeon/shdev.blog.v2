import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// 개별 도형을 위한 컴포넌트
const Shape3D = ({ createGeometry }: any) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const requestRef = useRef<number>(0);
  const controlsRef = useRef<OrbitControls | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 이전 렌더러 정리
    if (containerRef.current) {
      const oldCanvas = containerRef.current.querySelector("canvas");
      if (oldCanvas) {
        containerRef.current.removeChild(oldCanvas);
      }
      rendererRef.current = null;
    }

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf0f0f0);

    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5;

    // 새 렌더러 생성
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
      alpha: true,
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

    // 도형 생성
    const geometry = createGeometry();
    const material = new THREE.MeshBasicMaterial({});
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let isDisposed = false;

    // Animation loop
    const animate = () => {
      if (isDisposed) return;

      requestRef.current = requestAnimationFrame(animate);
      mesh.rotation.x += 0.005;
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
  }, [createGeometry]);

  return (
    <div className="flex flex-col items-center">
      <div className="h-full w-full" ref={containerRef} />
    </div>
  );
};

// 메인 컴포넌트는 동일
export const VariousGeometryExample = () => {
  const shapes = [
    {
      name: "Box",
      geometry: () => new THREE.BoxGeometry(2, 2, 2),
      color: 0xff0000,
    },
    {
      name: "Sphere",
      geometry: () => new THREE.SphereGeometry(1.5, 32, 32),
      color: 0x00ff00,
    },
    {
      name: "Plane",
      geometry: () => new THREE.PlaneGeometry(2, 2),
      color: 0x0000ff,
    },
    {
      name: "Cylinder",
      geometry: () => new THREE.CylinderGeometry(1, 1, 3),
      color: 0xffff00,
    },
    {
      name: "Cone",
      geometry: () => new THREE.ConeGeometry(1.5, 3, 32),
      color: 0xff00ff,
    },
    {
      name: "Torus",
      geometry: () => new THREE.TorusGeometry(1, 0.4, 16, 100),
      color: 0x00ffff,
    },
  ];

  return (
    <div className="container mx-auto p-1 md:p-8">
      <div className="grid grid-cols-3 gap-2 md:gap-6">
        {shapes.map((shape) => (
          <div key={shape.name} className="aspect-square rounded-lg">
            <Shape3D
              createGeometry={shape.geometry}
              color={shape.color}
              name={shape.name}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
