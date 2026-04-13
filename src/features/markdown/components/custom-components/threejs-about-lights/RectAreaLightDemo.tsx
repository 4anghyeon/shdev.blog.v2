import { type ChangeEvent, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";

export const RectAreaLightDemo = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    rectLight: THREE.RectAreaLight;
    helper: RectAreaLightHelper;
  } | null>(null);

  // 기본 설정
  const [intensity, setIntensity] = useState(5.0);
  const [color, setColor] = useState("#ffffff");
  const [width, setWidth] = useState(3);
  const [height, setHeight] = useState(2);

  // 초기 장면 설정
  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  useEffect(() => {
    if (!mountRef.current) return;
    if (mountRef.current.children.length > 0) {
      mountRef.current.children.item(0)?.remove();
    }

    // 기본 설정
    const containerWidth = mountRef.current.clientWidth;
    const containerHeight = mountRef.current.clientHeight;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#111827");

    // 카메라
    const camera = new THREE.PerspectiveCamera(
      75,
      containerWidth / containerHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 1, 5);

    // 렌더러
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerWidth, containerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // 컨트롤
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // 바닥과 벽 (RectAreaLight 효과를 보여주기 위함)
    const floorGeometry = new THREE.PlaneGeometry(10, 10);
    const wallGeometry = new THREE.PlaneGeometry(10, 5);

    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.7,
      metalness: 0.1,
    });

    // 바닥
    const floor = new THREE.Mesh(floorGeometry, material);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1;
    scene.add(floor);

    // 벽
    const wall = new THREE.Mesh(wallGeometry, material);
    wall.position.z = -3;
    wall.position.y = 1.5;
    scene.add(wall);

    // 몇 개의 물체
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const sphereGeometry = new THREE.SphereGeometry(0.7, 32, 32);

    const boxMaterial = new THREE.MeshStandardMaterial({
      color: 0x3366cc,
      roughness: 0.5,
      metalness: 0.2,
    });

    const sphereMaterial = new THREE.MeshStandardMaterial({
      color: 0xcc3366,
      roughness: 0.3,
      metalness: 0.4,
    });

    // 박스
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.set(-1.5, 0, 0);
    scene.add(box);

    // 구체
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(1.5, 0, 0);
    scene.add(sphere);

    // 희미한 환경광 (완전히 어둡지 않게)
    const ambientLight = new THREE.AmbientLight(0x404040, 0.2);
    scene.add(ambientLight);

    // RectAreaLight
    const rectLight = new THREE.RectAreaLight(color, intensity, width, height);
    rectLight.position.set(0, 1, 2);
    rectLight.lookAt(0, 0, 0);
    scene.add(rectLight);

    // RectAreaLight 헬퍼
    const helper = new RectAreaLightHelper(rectLight);
    scene.add(helper);

    // 참조 저장
    sceneRef.current = {
      scene,
      camera,
      renderer,
      controls,
      rectLight,
      helper,
    };

    // 애니메이션 루프
    const animate = () => {
      if (!sceneRef.current) return;

      animFrameRef.current = requestAnimationFrame(animate);
      sceneRef.current.controls.update();
      sceneRef.current.renderer.render(
        sceneRef.current.scene,
        sceneRef.current.camera,
      );
    };
    animate();

    // 윈도우 크기 변경 처리
    const handleResize = () => {
      if (!mountRef.current || !sceneRef.current) return;

      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;

      sceneRef.current.camera.aspect = width / height;
      sceneRef.current.camera.updateProjectionMatrix();
      sceneRef.current.renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // 정리
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", handleResize);
      if (mountRef.current && sceneRef.current) {
        mountRef.current.removeChild(sceneRef.current.renderer.domElement);
      }
      sceneRef.current?.scene.clear();
      sceneRef.current?.renderer.dispose();

      // 참조 초기화
      sceneRef.current = null;
    };
  }, []); // 마운트 시 한 번만 실행

  // 빛 속성 업데이트
  useEffect(() => {
    if (sceneRef.current && sceneRef.current.rectLight) {
      sceneRef.current.rectLight.intensity = intensity;
    }
  }, [intensity]);

  useEffect(() => {
    if (sceneRef.current && sceneRef.current.rectLight) {
      sceneRef.current.rectLight.color.set(color);
    }
  }, [color]);

  useEffect(() => {
    if (sceneRef.current && sceneRef.current.rectLight) {
      sceneRef.current.rectLight.width = width;
    }
  }, [width]);

  useEffect(() => {
    if (sceneRef.current && sceneRef.current.rectLight) {
      sceneRef.current.rectLight.height = height;
    }
  }, [height]);

  // 컨트롤 핸들러
  const handleIntensityChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIntensity(parseFloat(e.target.value));
  };

  const handleColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  };

  const handleWidthChange = (e: ChangeEvent<HTMLInputElement>) => {
    setWidth(parseFloat(e.target.value));
  };

  const handleHeightChange = (e: ChangeEvent<HTMLInputElement>) => {
    setHeight(parseFloat(e.target.value));
  };

  return (
    <div className="mt-4 flex w-full flex-col">
      <div className="mb-4 rounded-lg bg-gray-900 p-4">
        <span className="mb-2 font-bold text-lg text-white">
          RectAreaLight 데모
        </span>

        <div ref={mountRef} className="mb-4 h-64 w-full rounded"></div>

        <div className="grid grid-cols-1 gap-4 text-white md:grid-cols-2">
          <div>
            <span className="mb-1 block text-sm">
              조명 강도: {intensity.toFixed(1)}
            </span>
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={intensity}
              onChange={handleIntensityChange}
              className="w-full"
            />
          </div>

          <div>
            <span className="mb-1 block text-sm">조명 색상:</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={handleColorChange}
                className="rounded"
              />
              <span className="text-sm">{color}</span>
            </div>
          </div>

          <div>
            <span className="mb-1 block text-sm">너비: {width.toFixed(1)}</span>
            <input
              type="range"
              min="0.1"
              max="6"
              step="0.1"
              value={width}
              onChange={handleWidthChange}
              className="w-full"
            />
          </div>

          <div>
            <span className="mb-1 block text-sm">
              높이: {height.toFixed(1)}
            </span>
            <input
              type="range"
              min="0.1"
              max="6"
              step="0.1"
              value={height}
              onChange={handleHeightChange}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
