import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export const BufferGeometryExample = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (ref.current.children.length > 0) return;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    camera.position.set(-1, 4, 5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(ref.current.clientWidth, 300);

    ref.current.appendChild(renderer.domElement);

    new OrbitControls(camera, renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    // 삼각형의 꼭지점 좌표
    const vertices = new Float32Array([
      -1.0,
      -1.0,
      0.0, // v0
      1.0,
      -1.0,
      0.0, // v1
      0.0,
      1.0,
      0.0, // v2
    ]);

    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

    const material = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);

    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }

    animate();

    const handleResize = () => {
      if (!ref.current) return;
      renderer.setSize(ref.current.clientWidth, 300);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      ref.current?.removeChild(renderer.domElement);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="my-2 flex w-full justify-center">
      <div className="w-full max-w-100" ref={ref}></div>
    </div>
  );
};
