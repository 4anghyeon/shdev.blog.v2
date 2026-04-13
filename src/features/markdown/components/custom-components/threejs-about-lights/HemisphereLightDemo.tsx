import { type ChangeEvent, useEffect, useRef, useState } from "react";
import type { HemisphereLight, HemisphereLightHelper } from "three";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export const HemisphereLightDemo = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControls>(null);
  const lightRef = useRef<HemisphereLight>(null);
  const helperRef = useRef<HemisphereLightHelper>(null);
  const animFrameRef = useRef<number>(0);

  // HemisphereLight 속성
  const [intensity, setIntensity] = useState(1.0);
  const [skyColor, setSkyColor] = useState("#87CEEB"); // 밝은 하늘색
  const [groundColor, setGroundColor] = useState("#8B4513"); // 갈색 (땅색)
  const [showHelper, setShowHelper] = useState(true);

  // 날씨/환경 설정
  const [environment, setEnvironment] = useState<
    "sunny" | "cloudy" | "sunset" | "night"
  >("sunny");

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  useEffect(() => {
    if (!mountRef.current) return;
    if (mountRef.current.children.length > 0) {
      mountRef.current.children.item(0)?.remove();
    }

    // Scene setup
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const scene = new THREE.Scene();

    // 하늘 배경색 설정 (기본 하늘색)
    scene.background = new THREE.Color(skyColor);
    scene.fog = new THREE.Fog(skyColor, 10, 50);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 5, 15);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // 자연 환경 만들기
    // 땅 (조금 더 넓게)
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x567d46, // 초록색
      roughness: 0.8,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // 산 만들기 (간단한 콘 형태)
    const mountainGeometry = new THREE.ConeGeometry(10, 7, 4);
    const mountainMaterial = new THREE.MeshStandardMaterial({
      color: 0x4d5e4a,
      roughness: 0.9,
      metalness: 0.1,
    });

    // 원거리 산 여러 개
    const mountains = new THREE.Group();

    const mountain1 = new THREE.Mesh(mountainGeometry, mountainMaterial);
    mountain1.position.set(-15, 3.5, -20);
    mountain1.castShadow = true;
    mountain1.receiveShadow = true;
    mountains.add(mountain1);

    const mountain2 = new THREE.Mesh(mountainGeometry, mountainMaterial);
    mountain2.position.set(0, 3.5, -25);
    mountain2.castShadow = true;
    mountain2.receiveShadow = true;
    mountains.add(mountain2);

    const mountain3 = new THREE.Mesh(mountainGeometry, mountainMaterial);
    mountain3.position.set(15, 3.5, -20);
    mountain3.castShadow = true;
    mountain3.receiveShadow = true;
    mountains.add(mountain3);

    scene.add(mountains);

    // 나무 만들기
    const createTree = (x: number, z: number, height: number = 1) => {
      const tree = new THREE.Group();

      // 나무 기둥
      const trunkGeometry = new THREE.CylinderGeometry(
        0.2,
        0.3,
        1.5 * height,
        8,
      );
      const trunkMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b4513,
        roughness: 0.9,
        metalness: 0.1,
      });
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
      trunk.position.y = 0.75 * height;
      trunk.castShadow = true;
      trunk.receiveShadow = true;
      tree.add(trunk);

      // 나무 잎
      const leavesGeometry = new THREE.ConeGeometry(height, 2 * height, 8);
      const leavesMaterial = new THREE.MeshStandardMaterial({
        color: 0x2d572c,
        roughness: 0.8,
        metalness: 0.1,
      });
      const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
      leaves.position.y = 2 * height;
      leaves.castShadow = true;
      leaves.receiveShadow = true;
      tree.add(leaves);

      tree.position.set(x, 0, z);
      return tree;
    };

    // 여러 나무 추가
    const trees = new THREE.Group();

    // 무작위 위치에 나무 생성
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 5 + Math.random() * 15; // 5-20 사이의 거리
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;
      const height = 0.7 + Math.random() * 0.6; // 0.7-1.3 사이의 높이

      const tree = createTree(x, z, height);
      trees.add(tree);
    }

    scene.add(trees);

    // 바위 추가
    const rockGeometry = new THREE.DodecahedronGeometry(1, 0);
    const rockMaterial = new THREE.MeshStandardMaterial({
      color: 0x888888,
      roughness: 0.9,
      metalness: 0.2,
    });

    const rocks = new THREE.Group();

    for (let i = 0; i < 15; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 3 + Math.random() * 10; // 3-13 사이의 거리
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;

      const rock = new THREE.Mesh(rockGeometry, rockMaterial);
      rock.position.set(x, 0.3, z);
      rock.scale.set(
        0.2 + Math.random() * 0.3,
        0.2 + Math.random() * 0.5,
        0.2 + Math.random() * 0.3,
      );
      rock.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      );
      rock.castShadow = true;
      rock.receiveShadow = true;
      rocks.add(rock);
    }

    scene.add(rocks);

    // 중앙에 작은 캠프파이어 장소
    const campfireArea = new THREE.Mesh(
      new THREE.CircleGeometry(2, 32),
      new THREE.MeshStandardMaterial({
        color: 0xa0522d,
        roughness: 1.0,
        metalness: 0.0,
      }),
    );
    campfireArea.rotation.x = -Math.PI / 2;
    campfireArea.position.y = 0.01; // 땅 바로 위
    scene.add(campfireArea);

    // 작은 통나무 의자
    const logGeometry = new THREE.CylinderGeometry(0.3, 0.3, 1.5, 8);
    const logMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b4513,
      roughness: 1.0,
      metalness: 0.0,
    });

    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2;
      const log = new THREE.Mesh(logGeometry, logMaterial);
      log.position.set(Math.sin(angle) * 1.5, 0.3, Math.cos(angle) * 1.5);
      log.rotation.z = Math.PI / 2;
      log.castShadow = true;
      log.receiveShadow = true;
      scene.add(log);
    }

    // HemisphereLight
    const hemisphereLight = new THREE.HemisphereLight(
      skyColor,
      groundColor,
      intensity,
    );
    hemisphereLight.position.set(0, 20, 0);
    scene.add(hemisphereLight);
    lightRef.current = hemisphereLight;

    // HemisphereLight Helper
    const helper = new THREE.HemisphereLightHelper(hemisphereLight, 2);
    helper.visible = showHelper;
    scene.add(helper);
    helperRef.current = helper;

    // 태양(DirectionalLight)
    const sunLight = new THREE.DirectionalLight(0xffffeb, 0.6);
    sunLight.position.set(10, 20, 10);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.far = 50;
    sunLight.shadow.camera.left = -20;
    sunLight.shadow.camera.right = 20;
    sunLight.shadow.camera.top = 20;
    sunLight.shadow.camera.bottom = -20;
    scene.add(sunLight);

    // Animation loop
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current || !renderer) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
    };
  }, []);

  // Update light properties when state changes
  useEffect(() => {
    if (lightRef.current) {
      lightRef.current.intensity = intensity;
    }
  }, [intensity]);

  useEffect(() => {
    if (lightRef.current) {
      lightRef.current.color.set(skyColor);
    }
  }, [skyColor]);

  useEffect(() => {
    if (lightRef.current) {
      lightRef.current.groundColor.set(groundColor);
    }
  }, [groundColor]);

  useEffect(() => {
    if (helperRef.current) {
      helperRef.current.visible = showHelper;
    }
  }, [showHelper]);

  // 환경 설정에 따른 색상 변경
  useEffect(() => {
    switch (environment) {
      case "sunny":
        setSkyColor("#87CEEB");
        setGroundColor("#8B4513");
        setIntensity(1.0);
        break;
      case "cloudy":
        setSkyColor("#B4C4D4");
        setGroundColor("#606060");
        setIntensity(0.7);
        break;
      case "sunset":
        setSkyColor("#FF7F50");
        setGroundColor("#8B4500");
        setIntensity(0.8);
        break;
      case "night":
        setSkyColor("#0C1445");
        setGroundColor("#0C1445");
        setIntensity(0.2);
        break;
    }
  }, [environment]);

  const handleIntensityChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIntensity(parseFloat(e.target.value));
  };

  const handleSkyColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSkyColor(e.target.value);
  };

  const handleGroundColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGroundColor(e.target.value);
  };

  const handleHelperToggle = (e: ChangeEvent<HTMLInputElement>) => {
    setShowHelper(e.target.checked);
  };

  const handleEnvironmentChange = (
    env: "sunny" | "cloudy" | "sunset" | "night",
  ) => {
    setEnvironment(env);
  };

  return (
    <div className="mt-4 flex w-full flex-col">
      <div className="mb-4 rounded-lg bg-gray-900 p-4">
        <span className="mb-2 font-bold text-lg text-white">
          HemisphereLight 데모
        </span>
        <div ref={mountRef} className="mb-4 h-64 w-full rounded"></div>

        <div className="grid grid-cols-1 gap-4 text-white md:grid-cols-2">
          <div>
            <span className="mb-1 block text-sm">
              조명 강도: {intensity.toFixed(2)}
            </span>
            <input
              type="range"
              min="0"
              max="2"
              step="0.01"
              value={intensity}
              onChange={handleIntensityChange}
              className="w-full"
            />
          </div>

          <div>
            <span className="mb-1 block text-sm">하늘색:</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={skyColor}
                onChange={handleSkyColorChange}
                className="rounded"
              />
              <span className="text-sm">{skyColor}</span>
            </div>
          </div>

          <div>
            <span className="mb-1 block text-sm">지면색:</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={groundColor}
                onChange={handleGroundColorChange}
                className="rounded"
              />
              <span className="text-sm">{groundColor}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                id="hemisphere-helper"
                type="checkbox"
                checked={showHelper}
                onChange={handleHelperToggle}
                className="h-4 w-4"
              />
              <label htmlFor="hemisphere-helper" className="text-sm">
                HemisphereLight 헬퍼 표시
              </label>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2">
            <span className="mb-2 block text-sm">환경 프리셋:</span>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                className={`rounded p-2 text-xs ${environment === "sunny" ? "bg-blue-600" : "bg-gray-700"}`}
                onClick={() => handleEnvironmentChange("sunny")}
              >
                맑은 날
              </button>
              <button
                type="button"
                className={`rounded p-2 text-xs ${environment === "cloudy" ? "bg-blue-600" : "bg-gray-700"}`}
                onClick={() => handleEnvironmentChange("cloudy")}
              >
                흐린 날
              </button>
              <button
                type="button"
                className={`rounded p-2 text-xs ${environment === "sunset" ? "bg-blue-600" : "bg-gray-700"}`}
                onClick={() => handleEnvironmentChange("sunset")}
              >
                일몰
              </button>
              <button
                type="button"
                className={`rounded p-2 text-xs ${environment === "night" ? "bg-blue-600" : "bg-gray-700"}`}
                onClick={() => handleEnvironmentChange("night")}
              >
                밤
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
