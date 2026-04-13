import { type ChangeEvent, useEffect, useRef, useState } from "react";
import type { AmbientLight } from "three";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export const AmbientLightDemo = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControls>(null);
  const ambientLightRef = useRef<AmbientLight>(null);
  const animFrameRef = useRef<number>(0);
  const [ambientIntensity, setAmbientIntensity] = useState(0.3);
  const [ambientColor, setAmbientColor] = useState("#ffffff");

  const handleIntensityChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAmbientIntensity(parseFloat(e.target.value));
  };

  const handleColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAmbientColor(e.target.value);
  };

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
    camera.position.set(0, 2, 5);

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

    // Create a grid helper
    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);

    // Add objects to scene
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const torusGeometry = new THREE.TorusGeometry(0.4, 0.2, 16, 32);

    const material = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      roughness: 0.5,
      metalness: 0.5,
    });

    const redMaterial = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      roughness: 0.5,
      metalness: 0.2,
    });

    const greenMaterial = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.2,
      metalness: 0.8,
    });

    const cube = new THREE.Mesh(geometry, material);
    cube.position.x = -2;
    cube.castShadow = true;
    scene.add(cube);

    const sphere = new THREE.Mesh(sphereGeometry, redMaterial);
    sphere.position.x = 0;
    sphere.castShadow = true;
    scene.add(sphere);

    const torus = new THREE.Mesh(torusGeometry, greenMaterial);
    torus.position.x = 2;
    torus.castShadow = true;
    scene.add(torus);

    // Floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
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

    const ambientLight = new THREE.AmbientLight(ambientColor, ambientIntensity);
    scene.add(ambientLight);

    function animate() {
      animFrameRef.current = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }

    animate();

    ambientLightRef.current = ambientLight;

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

  useEffect(() => {
    if (ambientLightRef.current) {
      ambientLightRef.current.intensity = ambientIntensity;
    }
  }, [ambientIntensity]);

  useEffect(() => {
    if (ambientLightRef.current) {
      ambientLightRef.current.color.set(ambientColor);
    }
  }, [ambientColor]);

  return (
    <div className="mt-4 flex w-full flex-col">
      <div className="mb-4 rounded-lg bg-gray-900 p-4">
        <span className="mb-2 font-bold text-lg text-white">
          AmbientLight 데모
        </span>
        <div ref={mountRef} className="mb-4 h-64 w-full rounded"></div>
        <div className="flex flex-col gap-4 text-white">
          <div>
            <span className="mb-1 block text-sm">
              조명 강도: {ambientIntensity.toFixed(2)}
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={ambientIntensity}
              onChange={handleIntensityChange}
              className="w-full"
            />
          </div>

          <div>
            <span className="mb-1 block text-sm">조명 색상:</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={ambientColor}
                onChange={handleColorChange}
                className="rounded"
              />
              <span className="text-sm">{ambientColor}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
