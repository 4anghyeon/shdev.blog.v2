import { type ChangeEvent, useEffect, useRef, useState } from "react";
import type { PointLight, PointLightHelper } from "three";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export const PointLightDemo = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControls>(null);
  const lightRef = useRef<PointLight>(null);
  const helperRef = useRef<PointLightHelper>(null);
  const animFrameRef = useRef<number>(0);

  // PointLight 속성
  const [intensity, setIntensity] = useState(1.0);
  const [color, setColor] = useState("#ff9900");
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(2);
  const [positionZ, setPositionZ] = useState(0);
  const [distance, setDistance] = useState(10);
  const [decay, setDecay] = useState(2);
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
    camera.position.set(0, 4, 8);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // Grid helper
    const gridHelper = new THREE.GridHelper(20, 20);
    scene.add(gridHelper);

    // Create room environment
    const roomSize = 10;

    // Wall material
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      roughness: 0.8,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });

    // Floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(roomSize, roomSize),
      wallMaterial,
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -roomSize / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Back wall
    const backWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomSize, roomSize),
      wallMaterial,
    );
    backWall.position.z = -roomSize / 2;
    backWall.receiveShadow = true;
    scene.add(backWall);

    // Left wall
    const leftWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomSize, roomSize),
      wallMaterial,
    );
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.x = -roomSize / 2;
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    // Right wall
    const rightWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomSize, roomSize),
      wallMaterial,
    );
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.x = roomSize / 2;
    rightWall.receiveShadow = true;
    scene.add(rightWall);

    // Add objects to scene
    // Create a few different objects to show shadows and light falloff
    const objects: THREE.Mesh[] = [];

    // Column 1
    const cylinder1 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.5, 4, 16),
      new THREE.MeshStandardMaterial({
        color: 0xffcc00,
        roughness: 0.7,
        metalness: 0.1,
      }),
    );
    cylinder1.position.set(-3, -roomSize / 2 + 2, -3);
    cylinder1.castShadow = true;
    cylinder1.receiveShadow = true;
    scene.add(cylinder1);
    objects.push(cylinder1);

    // Column 2
    const cylinder2 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.5, 4, 16),
      new THREE.MeshStandardMaterial({
        color: 0x00ccff,
        roughness: 0.7,
        metalness: 0.1,
      }),
    );
    cylinder2.position.set(3, -roomSize / 2 + 2, -3);
    cylinder2.castShadow = true;
    cylinder2.receiveShadow = true;
    scene.add(cylinder2);
    objects.push(cylinder2);

    // Column 3
    const cylinder3 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.5, 4, 16),
      new THREE.MeshStandardMaterial({
        color: 0xcc44ff,
        roughness: 0.7,
        metalness: 0.1,
      }),
    );
    cylinder3.position.set(-3, -roomSize / 2 + 2, 3);
    cylinder3.castShadow = true;
    cylinder3.receiveShadow = true;
    scene.add(cylinder3);
    objects.push(cylinder3);

    // Column 4
    const cylinder4 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.5, 4, 16),
      new THREE.MeshStandardMaterial({
        color: 0x44ff88,
        roughness: 0.7,
        metalness: 0.1,
      }),
    );
    cylinder4.position.set(3, -roomSize / 2 + 2, 3);
    cylinder4.castShadow = true;
    cylinder4.receiveShadow = true;
    scene.add(cylinder4);
    objects.push(cylinder4);

    // Center table
    const table = new THREE.Group();

    const tableTop = new THREE.Mesh(
      new THREE.BoxGeometry(3, 0.1, 3),
      new THREE.MeshStandardMaterial({
        color: 0x885533,
        roughness: 0.8,
        metalness: 0.1,
      }),
    );
    tableTop.position.y = 0;
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    table.add(tableTop);

    const tableLeg1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 1, 0.2),
      new THREE.MeshStandardMaterial({
        color: 0x885533,
        roughness: 0.8,
        metalness: 0.1,
      }),
    );
    tableLeg1.position.set(-1.3, -0.5, -1.3);
    tableLeg1.castShadow = true;
    tableLeg1.receiveShadow = true;
    table.add(tableLeg1);

    const tableLeg2 = tableLeg1.clone();
    tableLeg2.position.set(1.3, -0.5, -1.3);
    table.add(tableLeg2);

    const tableLeg3 = tableLeg1.clone();
    tableLeg3.position.set(-1.3, -0.5, 1.3);
    table.add(tableLeg3);

    const tableLeg4 = tableLeg1.clone();
    tableLeg4.position.set(1.3, -0.5, 1.3);
    table.add(tableLeg4);

    table.position.y = -roomSize / 2 + 1.5;
    scene.add(table);

    // Small objects on table
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 32, 32),
      new THREE.MeshStandardMaterial({
        color: 0xff0000,
        roughness: 0.2,
        metalness: 0.8,
      }),
    );
    sphere.position.set(-0.8, -roomSize / 2 + 1.95, -0.8);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    scene.add(sphere);
    objects.push(sphere);

    const box = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.4, 0.4),
      new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        roughness: 0.3,
        metalness: 0.5,
      }),
    );
    box.position.set(0.8, -roomSize / 2 + 1.95, 0.8);
    box.rotation.y = Math.PI / 4;
    box.castShadow = true;
    box.receiveShadow = true;
    scene.add(box);
    objects.push(box);

    const torus = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.2, 0.07, 64, 8),
      new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        roughness: 0.3,
        metalness: 0.7,
      }),
    );
    torus.position.set(0, -roomSize / 2 + 1.95, 0);
    torus.castShadow = true;
    torus.receiveShadow = true;
    scene.add(torus);
    objects.push(torus);

    // Add ambient light (very dim)
    const ambientLight = new THREE.AmbientLight(0x404040, 0.05);
    scene.add(ambientLight);

    // PointLight
    const pointLight = new THREE.PointLight(color, intensity, distance, decay);
    pointLight.position.set(positionX, positionY, positionZ);
    pointLight.castShadow = castShadow;

    // Shadow settings for point light
    pointLight.shadow.mapSize.width = 1024;
    pointLight.shadow.mapSize.height = 1024;
    pointLight.shadow.camera.near = 0.1;
    pointLight.shadow.camera.far = 25;

    scene.add(pointLight);
    lightRef.current = pointLight;

    // PointLight Helper
    const helper = new THREE.PointLightHelper(pointLight, 0.3);
    helper.visible = showHelper;
    scene.add(helper);
    helperRef.current = helper;

    // Light bulb mesh to visualize the light source
    const bulbGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const bulbMaterial = new THREE.MeshBasicMaterial({
      color: pointLight.color,
    });
    const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial);
    bulb.position.copy(pointLight.position);
    scene.add(bulb);

    // Animation loop
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      // Optional: Add subtle animation to objects
      torus.rotation.x += 0.01;
      torus.rotation.y += 0.01;
      box.rotation.y += 0.005;

      bulb.position.copy(pointLight.position);
      bulbMaterial.color = pointLight.color;

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
      lightRef.current.distance = distance;
    }
  }, [distance]);

  useEffect(() => {
    if (lightRef.current) {
      lightRef.current.decay = decay;
    }
  }, [decay]);

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

  const handleDistanceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDistance(parseFloat(e.target.value));
  };

  const handleDecayChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDecay(parseFloat(e.target.value));
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
          PointLight 데모
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
              max="3"
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
              min="-5"
              max="5"
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
              min="-5"
              max="5"
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
              min="-5"
              max="5"
              step="0.1"
              value={positionZ}
              onChange={(e) =>
                handlePositionChange("z", parseFloat(e.target.value))
              }
              className="w-full"
            />
          </div>

          <div>
            <span className="mb-1 block text-sm">
              거리(최대 도달 거리): {distance.toFixed(1)}
            </span>
            <input
              type="range"
              min="0"
              max="20"
              step="0.1"
              value={distance}
              onChange={handleDistanceChange}
              className="w-full"
            />
          </div>

          <div>
            <span className="mb-1 block text-sm">
              감쇠율(decay): {decay.toFixed(1)}
            </span>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={decay}
              onChange={handleDecayChange}
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
                id="point-heler"
                type="checkbox"
                checked={showHelper}
                onChange={handleHelperToggle}
                className="h-4 w-4"
              />
              <label htmlFor="point-heler" className="text-sm">
                PointLight 헬퍼 표시
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
