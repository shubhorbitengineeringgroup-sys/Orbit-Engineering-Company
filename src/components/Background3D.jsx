import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Background3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || navigator.connection?.saveData || ['slow-2g', '2g'].includes(navigator.connection?.effectiveType)) return;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 35;
    camera.position.y = 10;
    camera.lookAt(0, 0, 0);

    // Renderer
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); }
    catch { return; }
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Geometry: Flowing wave particle grid representing water flow & pipelines
    const rows = 50;
    const cols = 70;
    const count = rows * cols;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const color1 = new THREE.Color('#0073bc'); // Orbit blue
    const color2 = new THREE.Color('#0ea5e9'); // Sky blue
    const color3 = new THREE.Color('#38bdf8'); // Cyan light

    let idx = 0;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const x = (j - cols / 2) * 1.6;
        const z = (i - rows / 2) * 1.6;
        const y = 0;

        positions[idx * 3] = x;
        positions[idx * 3 + 1] = y;
        positions[idx * 3 + 2] = z;

        const mixedColor = color1.clone().lerp(color2, (i / rows)).lerp(color3, (j / cols) * 0.5);
        colors[idx * 3] = mixedColor.r;
        colors[idx * 3 + 1] = mixedColor.g;
        colors[idx * 3 + 2] = mixedColor.b;

        idx++;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle texture
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.3, 'rgba(0,115,188,0.8)');
    grad.addColorStop(1, 'rgba(0,115,188,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);

    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 0.9,
      vertexColors: true,
      map: texture,
      transparent: true,
      opacity: 0.45,
      blending: THREE.NormalBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    particles.rotation.x = 0.4;
    scene.add(particles);

    // Floating 3D Water Geometric Polyhedron (ambient 3D element)
    const icosaGeometry = new THREE.IcosahedronGeometry(7, 1);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      wireframe: true,
      transparent: true,
      opacity: 0.08
    });
    const icosa = new THREE.Mesh(icosaGeometry, wireframeMaterial);
    icosa.position.set(22, 5, -10);
    scene.add(icosa);

    const icosa2 = new THREE.Mesh(
      new THREE.IcosahedronGeometry(5, 1),
      new THREE.MeshBasicMaterial({
        color: 0x0073bc,
        wireframe: true,
        transparent: true,
        opacity: 0.06
      })
    );
    icosa2.position.set(-24, 8, -5);
    scene.add(icosa2);

    // Mouse responsiveness
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.005;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.005;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Resize
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (document.hidden) return;
      const time = clock.getElapsedTime() * 0.8;

      // Gentle camera mouse follow
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;
      camera.position.x = targetX * 10;
      camera.position.y = 10 - targetY * 8;
      camera.lookAt(0, 0, 0);

      // Undulate wave
      const pos = geometry.attributes.position.array;
      let pIdx = 0;
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const u = (j / cols) * Math.PI * 4;
          const v = (i / rows) * Math.PI * 4;
          pos[pIdx * 3 + 1] = Math.sin(u + time) * 1.8 + Math.cos(v + time * 0.8) * 1.8;
          pIdx++;
        }
      }
      geometry.attributes.position.needsUpdate = true;

      // Rotate polyhedrons
      icosa.rotation.x += 0.003;
      icosa.rotation.y += 0.004;
      icosa2.rotation.x -= 0.002;
      icosa2.rotation.y += 0.003;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      texture.dispose();
      icosaGeometry.dispose();
      wireframeMaterial.dispose();
      icosa2.geometry.dispose();
      icosa2.material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
      style={{ opacity: 0.85 }}
    />
  );
}
