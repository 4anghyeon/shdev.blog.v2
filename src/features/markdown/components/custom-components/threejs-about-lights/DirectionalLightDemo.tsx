import { type ChangeEvent, useEffect, useRef, useState } from "react";
import type { DirectionalLight, DirectionalLightHelper } from "three";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export const DirectionalLightDemo = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControls>(null);
  const lightRef = useRef<DirectionalLight>(null);
  const helperRef = useRef<DirectionalLightHelper>(null);
  const animFrameRef = useRef<number>(0);

  // DirectionalLight 속성
  const [intensity, setIntensity] = useState(0.5);
  const [color, setColor] = useState("#ffffff");
  const [positionX, setPositionX] = useState(5);
  const [positionY, setPositionY] = useState(5);
  const [positionZ, setPositionZ] = useState(5);
  const [castShadow, setCastShadow] = useState(true);
  const [showHelper, setShowHelper] = useState(true);

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
    scene.background = new THREE.Color("#111827");

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 3, 7);

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

    // Grid helper
    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);

    // Add objects to scene
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const torusGeometry = new THREE.TorusGeometry(0.4, 0.2, 16, 32);
    const coneGeometry = new THREE.ConeGeometry(0.5, 1, 16);

    const blueMaterial = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      roughness: 0.5,
      metalness: 0.2,
    });

    const redMaterial = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      roughness: 0.5,
      metalness: 0.2,
    });

    const greenMaterial = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.2,
      metalness: 0.3,
    });

    const yellowMaterial = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      roughness: 0.4,
      metalness: 0.3,
    });

    // Create meshes
    const cube = new THREE.Mesh(cubeGeometry, blueMaterial);
    cube.position.set(-2, 0, 0);
    cube.castShadow = true;
    scene.add(cube);

    const sphere = new THREE.Mesh(sphereGeometry, redMaterial);
    sphere.position.set(0, 0, 0);
    sphere.castShadow = true;
    scene.add(sphere);

    const torus = new THREE.Mesh(torusGeometry, greenMaterial);
    torus.position.set(2, 0, 0);
    torus.castShadow = true;
    scene.add(torus);

    const cone = new THREE.Mesh(coneGeometry, yellowMaterial);
    cone.position.set(0, 0, -2);
    cone.castShadow = true;
    scene.add(cone);

    // Floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.MeshStandardMaterial({
        color: 0x6b7280,
        roughness: 0.8,
        metalness: 0.2,
      }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1;
    floor.receiveShadow = true;
    scene.add(floor);

    // Add ambient light (faint)
    const ambientLight = new THREE.AmbientLight(0x404040, 0.2);
    scene.add(ambientLight);

    // DirectionalLight
    const directionalLight = new THREE.DirectionalLight(color, intensity);
    directionalLight.position.set(positionX, positionY, positionZ);
    directionalLight.castShadow = castShadow;

    // Shadow settings for directional light
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;

    scene.add(directionalLight);
    lightRef.current = directionalLight;

    // DirectionalLight Helper
    const helper = new THREE.DirectionalLightHelper(directionalLight, 1);
    helper.visible = showHelper;
    scene.add(helper);
    helperRef.current = helper;

    // Shadow camera helper (optional)
    const shadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
    shadowHelper.visible = false;
    scene.add(shadowHelper);

    // Animation loop
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      cube.rotation.x += 0.005;
      cube.rotation.y += 0.005;

      sphere.rotation.y += 0.007;

      torus.rotation.x += 0.003;
      torus.rotation.y += 0.003;

      cone.rotation.y += 0.006;

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
      lightRef.current.color.set(color);
    }
  }, [color]);

  useEffect(() => {
    if (lightRef.current) {
      lightRef.current.position.set(positionX, positionY, positionZ);
      if (helperRef.current) {
        helperRef.current.update();
      }
    }
  }, [positionX, positionY, positionZ]);

  useEffect(() => {
    if (lightRef.current) {
      lightRef.current.castShadow = castShadow;
    }
  }, [castShadow]);

  useEffect(() => {
    if (helperRef.current) {
      helperRef.current.visible = showHelper;
    }
  }, [showHelper]);

  const handleIntensityChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIntensity(parseFloat(e.target.value));
  };

  const handleColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  };

  const handlePositionChange = (axis: "x" | "y" | "z", value: number) => {
    if (axis === "x") setPositionX(value);
    if (axis === "y") setPositionY(value);
    if (axis === "z") setPositionZ(value);
  };

  const handleCastShadowChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCastShadow(e.target.checked);
  };

  const handleHelperToggle = (e: ChangeEvent<HTMLInputElement>) => {
    setShowHelper(e.target.checked);
  };

  return (
    <div className="mt-4 flex w-full flex-col">
      <div className="mb-4 rounded-lg bg-gray-900 p-4">
        <span className="mb-2 font-bold text-lg text-white">
          DirectionalLight 데모
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
            <span className="mb-1 block text-sm">
              X 위치: {positionX.toFixed(1)}
            </span>
            <input
              type="range"
              min="-10"
              max="10"
              step="0.1"
              value={positionX}
              onChange={(e) =>
                handlePositionChange("x", parseFloat(e.target.value))
              }
              className="w-full"
            />
          </div>

          <div>
            <span className="mb-1 block text-sm">
              Y 위치: {positionY.toFixed(1)}
            </span>
            <input
              type="range"
              min="-10"
              max="10"
              step="0.1"
              value={positionY}
              onChange={(e) =>
                handlePositionChange("y", parseFloat(e.target.value))
              }
              className="w-full"
            />
          </div>

          <div>
            <span className="mb-1 block text-sm">
              Z 위치: {positionZ.toFixed(1)}
            </span>
            <input
              type="range"
              min="-10"
              max="10"
              step="0.1"
              value={positionZ}
              onChange={(e) =>
                handlePositionChange("z", parseFloat(e.target.value))
              }
              className="w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                id="castShadowToggle"
                type="checkbox"
                checked={castShadow}
                onChange={handleCastShadowChange}
                className="h-4 w-4"
              />
              <label htmlFor="castShadowToggle" className="text-sm">
                그림자 생성
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="directional-helper"
                type="checkbox"
                checked={showHelper}
                onChange={handleHelperToggle}
                className="h-4 w-4"
              />
              <label htmlFor="directional-helper" className="text-sm">
                DirectionalLight 헬퍼 표시
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
