import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const createMaterials = (color: number) => ({
  Basic: new THREE.MeshBasicMaterial({
    color: color,
    side: THREE.DoubleSide,
  }),
  Standard: new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.5,
    metalness: 0.5,
    side: THREE.DoubleSide,
  }),
  Phong: new THREE.MeshPhongMaterial({
    color: color,
    shininess: 60,
    specular: 0x444444,
    side: THREE.DoubleSide,
  }),
});

const Shape3D = ({
  materialType,
  color,
}: {
  materialType: string;
  color: number;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const requestRef = useRef<number>(0);
  const controlsRef = useRef<OrbitControls | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

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

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controlsRef.current = controls;

    const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
    const materials = createMaterials(color);
    const material = materials[materialType as keyof typeof materials];
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let isDisposed = false;

    const animate = () => {
      if (isDisposed) return;

      requestRef.current = requestAnimationFrame(animate);
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.01;
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

    return () => {
      isDisposed = true;

      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }

      if (controlsRef.current) {
        controlsRef.current.dispose();
        controlsRef.current = null;
      }

      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          if (object.geometry) {
            object.geometry.dispose();
          }
          if (Array.isArray(object.material)) {
            // biome-ignore lint/suspicious/useIterableCallbackReturn: <>
            object.material.forEach((material) => material.dispose());
          } else if (object.material) {
            object.material.dispose();
          }
        }
      });

      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current.forceContextLoss();
        rendererRef.current = null;
      }

      if (sceneRef.current) {
        sceneRef.current = null;
      }

      window.removeEventListener("resize", handleResize);
    };
  }, [materialType, color]);

  return (
    <div className="flex flex-col items-center">
      <div className="h-full w-full" ref={containerRef} />
      <p className="mt-2 text-center font-semibold text-sm">{`Mesh${materialType}Material`}</p>
    </div>
  );
};

export const VariousMaterialExample = () => {
  const materials = [
    {
      type: "Basic",
      color: 0x049ef4,
    },
    {
      type: "Standard",
      color: 0x049ef4,
    },
    {
      type: "Phong",
      color: 0x049ef4,
    },
  ];

  return (
    <div className="container mx-auto p-1">
      <div className="grid grid-cols-1 gap-1 sm:grid-cols-3 md:gap-4">
        {materials.map((material) => (
          <div key={material.type} className="aspect-square p-1 md:p-4">
            <Shape3D materialType={material.type} color={material.color} />
          </div>
        ))}
      </div>
    </div>
  );
};
