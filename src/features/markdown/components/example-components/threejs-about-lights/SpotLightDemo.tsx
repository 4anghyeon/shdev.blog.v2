import { type ChangeEvent, useEffect, useRef, useState } from "react";
import type { SpotLight, SpotLightHelper } from "three";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export const SpotLightDemo = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControls>(null);
  const lightRef = useRef<SpotLight>(null);
  const helperRef = useRef<SpotLightHelper>(null);
  const targetRef = useRef<THREE.Object3D>(null);
  const animFrameRef = useRef<number>(0);

  // SpotLight 속성
  const [intensity, setIntensity] = useState(1.0);
  const [color, setColor] = useState("#ffffff");
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(5);
  const [positionZ, setPositionZ] = useState(0);
  const [targetX, setTargetX] = useState(0);
  const [targetZ, setTargetZ] = useState(0);
  const [angle, setAngle] = useState(Math.PI / 6); // 30도
  const [penumbra, setPenumbra] = useState(0.1);
  const [distance, setDistance] = useState(15);
  const [decay, setDecay] = useState(0.1);
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
    scene.fog = new THREE.Fog(0x111827, 10, 30);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 5, 12);

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
    const gridHelper = new THREE.GridHelper(30, 30);
    scene.add(gridHelper);

    // Create stage/theater-like environment
    // Floor
    const floorGeometry = new THREE.PlaneGeometry(30, 30);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      roughness: 0.8,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Add some objects to show the spotlight effect
    // Central stage platform
    const platformGeometry = new THREE.CylinderGeometry(3, 3, 0.2, 32);
    const platformMaterial = new THREE.MeshStandardMaterial({
      color: 0x555555,
      roughness: 0.7,
      metalness: 0.2,
    });
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.position.y = 0.1;
    platform.receiveShadow = true;
    scene.add(platform);

    // Create some performers/props on the stage
    // First performer (dancer)
    const dancer = new THREE.Group();

    // Body
    const bodyGeometry = new THREE.CapsuleGeometry(0.25, 1, 4, 8);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x3366ff,
      roughness: 0.7,
      metalness: 0.1,
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.75;
    body.castShadow = true;
    dancer.add(body);

    // Head
    const headGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const headMaterial = new THREE.MeshStandardMaterial({
      color: 0xffccaa,
      roughness: 0.7,
      metalness: 0.1,
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.55;
    head.castShadow = true;
    dancer.add(head);

    // Arms
    const armGeometry = new THREE.CapsuleGeometry(0.07, 0.6, 4, 8);

    const leftArm = new THREE.Mesh(armGeometry, bodyMaterial);
    leftArm.position.set(0.4, 0.9, 0);
    leftArm.rotation.z = -Math.PI / 4;
    leftArm.castShadow = true;
    dancer.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, bodyMaterial);
    rightArm.position.set(-0.4, 0.9, 0);
    rightArm.rotation.z = Math.PI / 4;
    rightArm.castShadow = true;
    dancer.add(rightArm);

    // Legs
    const legGeometry = new THREE.CapsuleGeometry(0.1, 0.7, 4, 8);

    const leftLeg = new THREE.Mesh(legGeometry, bodyMaterial);
    leftLeg.position.set(0.15, 0.15, 0);
    leftLeg.castShadow = true;
    dancer.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry, bodyMaterial);
    rightLeg.position.set(-0.15, 0.15, 0);
    rightLeg.castShadow = true;
    dancer.add(rightLeg);

    dancer.position.set(0, 0.3, 0);
    scene.add(dancer);

    // Add some props around the stage
    const propsCount = 8;
    const radius = 2.5;
    const propGeometries = [
      new THREE.BoxGeometry(0.4, 0.4, 0.4),
      new THREE.SphereGeometry(0.2, 16, 16),
      new THREE.TetrahedronGeometry(0.3),
      new THREE.TorusGeometry(0.2, 0.1, 16, 36),
      new THREE.ConeGeometry(0.2, 0.5, 16),
    ];

    const propMaterials = [
      new THREE.MeshStandardMaterial({
        color: 0xff5555,
        roughness: 0.7,
        metalness: 0.2,
      }),
      new THREE.MeshStandardMaterial({
        color: 0x55ff55,
        roughness: 0.7,
        metalness: 0.2,
      }),
      new THREE.MeshStandardMaterial({
        color: 0x5555ff,
        roughness: 0.7,
        metalness: 0.2,
      }),
      new THREE.MeshStandardMaterial({
        color: 0xffff55,
        roughness: 0.7,
        metalness: 0.2,
      }),
      new THREE.MeshStandardMaterial({
        color: 0xff55ff,
        roughness: 0.7,
        metalness: 0.2,
      }),
    ];

    for (let i = 0; i < propsCount; i++) {
      const angle = (i / propsCount) * Math.PI * 2;
      const propIndex = i % propGeometries.length;

      const prop = new THREE.Mesh(
        propGeometries[propIndex],
        propMaterials[propIndex],
      );
      prop.position.set(
        Math.cos(angle) * radius,
        0.4, // Slightly above platform
        Math.sin(angle) * radius,
      );
      prop.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      );
      prop.castShadow = true;
      prop.receiveShadow = true;
      scene.add(prop);
    }

    // Additional tall objects around the scene
    const pillarGeometry = new THREE.CylinderGeometry(0.2, 0.2, 3, 8);
    const pillarMaterial = new THREE.MeshStandardMaterial({
      color: 0x888888,
      roughness: 0.7,
      metalness: 0.3,
    });

    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const distance = 7;

      const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
      pillar.position.set(
        Math.cos(angle) * distance,
        1.5, // Half height
        Math.sin(angle) * distance,
      );
      pillar.castShadow = true;
      pillar.receiveShadow = true;
      scene.add(pillar);
    }

    // Add very dim ambient light so objects aren't completely black
    const ambientLight = new THREE.AmbientLight(0x333333, 0.1);
    scene.add(ambientLight);

    // SpotLight target
    const target = new THREE.Object3D();
    target.position.set(targetX, 0, targetZ);
    scene.add(target);
    targetRef.current = target;

    // SpotLight
    const spotLight = new THREE.SpotLight(
      color,
      intensity,
      distance,
      angle,
      penumbra,
      decay,
    );
    spotLight.position.set(positionX, positionY, positionZ);
    spotLight.target = target;
    spotLight.castShadow = castShadow;

    // Shadow settings for spot light
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.near = 0.5;
    spotLight.shadow.camera.far = 30;

    scene.add(spotLight);
    lightRef.current = spotLight;

    // Visualize the light source as a small sphere
    const lightBulbGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const lightBulbMaterial = new THREE.MeshBasicMaterial({ color: color });
    const lightBulb = new THREE.Mesh(lightBulbGeometry, lightBulbMaterial);
    lightBulb.position.copy(spotLight.position);
    scene.add(lightBulb);

    // SpotLight Helper
    const helper = new THREE.SpotLightHelper(spotLight);
    helper.visible = showHelper;
    scene.add(helper);
    helperRef.current = helper;

    // Animation loop
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      // Animate dancer rotating slowly
      dancer.rotation.y += 0.01;

      // Update light bulb position
      lightBulb.position.copy(spotLight.position);
      lightBulbMaterial.color = spotLight.color;

      // Update helper if needed
      if (helperRef.current) {
        helperRef.current.update();
      }

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
    if (targetRef.current) {
      targetRef.current.position.set(targetX, 0, targetZ);
      if (helperRef.current) {
        helperRef.current.update();
      }
    }
  }, [targetX, targetZ]);

  useEffect(() => {
    if (lightRef.current) {
      lightRef.current.angle = angle;
      if (helperRef.current) {
        helperRef.current.update();
      }
    }
  }, [angle]);

  useEffect(() => {
    if (lightRef.current) {
      lightRef.current.penumbra = penumbra;
    }
  }, [penumbra]);

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

  const handleTargetChange = (axis: "x" | "z", value: number) => {
    if (axis === "x") setTargetX(value);
    if (axis === "z") setTargetZ(value);
  };

  const handleAngleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAngle(parseFloat(e.target.value));
  };

  const handlePenumbraChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPenumbra(parseFloat(e.target.value));
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

  // Convert angle from radians to degrees for display
  const angleDegrees = ((angle * 180) / Math.PI).toFixed(1);

  return (
    <div className="mt-4 flex w-full flex-col">
      <div className="mb-4 rounded-lg bg-gray-900 p-4">
        <span className="mb-2 font-bold text-lg text-white">
          SpotLight 데모
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
              min="0"
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

          <div>
            <span className="mb-1 block text-sm">
              대상 X 위치: {targetX.toFixed(1)}
            </span>
            <input
              type="range"
              min="-10"
              max="10"
              step="0.1"
              value={targetX}
              onChange={(e) =>
                handleTargetChange("x", parseFloat(e.target.value))
              }
              className="w-full"
            />
          </div>

          <div>
            <span className="mb-1 block text-sm">
              대상 Z 위치: {targetZ.toFixed(1)}
            </span>
            <input
              type="range"
              min="-10"
              max="10"
              step="0.1"
              value={targetZ}
              onChange={(e) =>
                handleTargetChange("z", parseFloat(e.target.value))
              }
              className="w-full"
            />
          </div>

          <div>
            <span className="mb-1 block text-sm">빛 각도: {angleDegrees}°</span>
            <input
              type="range"
              min="0.05"
              max="1.0"
              step="0.01"
              value={angle}
              onChange={handleAngleChange}
              className="w-full"
            />
          </div>

          <div>
            <span className="mb-1 block text-sm">
              가장자리 흐림(Penumbra): {penumbra.toFixed(2)}
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={penumbra}
              onChange={handlePenumbraChange}
              className="w-full"
            />
          </div>

          <div>
            <span className="mb-1 block text-sm">
              거리: {distance.toFixed(1)}
            </span>
            <input
              type="range"
              min="0"
              max="30"
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
                id="spotlight-helper"
                type="checkbox"
                checked={showHelper}
                onChange={handleHelperToggle}
                className="h-4 w-4"
              />
              <label htmlFor="spotlight-helper" className="text-sm">
                SpotLight 헬퍼 표시
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
