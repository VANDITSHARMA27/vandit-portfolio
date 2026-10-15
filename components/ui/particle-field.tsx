"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Interactive particle "light field" seeded on a torus knot.
 * Re-engineered from the woven-light reference for production:
 *  - zero per-frame allocation (mutates Float32Arrays with scalar math)
 *  - device-scaled particle count + capped DPR
 *  - pauses RAF when offscreen (IntersectionObserver) or tab hidden
 *  - no-op under reduced-motion / no-WebGL (CSS fallback shows through)
 */
export function ParticleField({ className }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    // WebGL capability check
    try {
      const test = document.createElement("canvas");
      if (
        !(
          test.getContext("webgl2") ||
          test.getContext("webgl") ||
          test.getContext("experimental-webgl")
        )
      ) {
        return;
      }
    } catch {
      return;
    }

    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || window.innerHeight;

    // Device-scaled particle budget
    const isMobile = window.innerWidth < 768;
    const lowMem =
      (navigator as Navigator & { deviceMemory?: number }).deviceMemory !== undefined &&
      (navigator as Navigator & { deviceMemory?: number }).deviceMemory! <= 4;
    // Per-frame the loop touches every particle on the main thread, so the
    // count drives Interaction-to-Next-Paint. Desktop keeps the full, dense
    // knot (15k) — trimming it visibly thinned the shape. Mobile/low-mem get
    // a lighter budget where the main thread is tighter anyway.
    const PARTICLES = isMobile ? 5000 : lowMem ? 9000 : 15000;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    // Pull the camera back on narrow/portrait viewports so the wide torus knot
    // stays fully framed (FOV is vertical, so on tall phone screens the knot
    // would otherwise get clipped on the sides and look squashed).
    const fitZ = (aspect: number) => {
      const vHalf = Math.tan((75 * Math.PI) / 180 / 2); // tan(vFOV/2)
      const target = 2.6; // knot half-extent + margin
      const distV = target / vHalf;
      const distH = target / (vHalf * aspect);
      return Math.max(5, distV, distH);
    };
    camera.position.z = fitZ(width / height);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Seed positions from a torus knot's vertices
    const knot = new THREE.TorusKnotGeometry(1.5, 0.5, 220, 32);
    const knotPos = knot.attributes.position;
    const knotCount = knotPos.count;

    const positions = new Float32Array(PARTICLES * 3);
    const original = new Float32Array(PARTICLES * 3);
    const velocities = new Float32Array(PARTICLES * 3);
    const colors = new Float32Array(PARTICLES * 3);

    // Pure monochrome: white particles with subtle greyscale variation.
    for (let i = 0; i < PARTICLES; i++) {
      const v = (i % knotCount) * 1;
      const x = knotPos.getX(v);
      const y = knotPos.getY(v);
      const z = knotPos.getZ(v);
      const i3 = i * 3;
      positions[i3] = original[i3] = x;
      positions[i3 + 1] = original[i3 + 1] = y;
      positions[i3 + 2] = original[i3 + 2] = z;

      const shade = 0.55 + Math.random() * 0.45; // 0.55–1.0 grey → white
      colors[i3] = shade;
      colors[i3 + 1] = shade;
      colors[i3 + 2] = shade;
    }
    knot.dispose();

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.022,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Pointer in world space (z = 0 plane)
    let mouseX = -999;
    let mouseY = -999;
    const onPointer = (e: PointerEvent) => {
      mouseX = ((e.clientX / window.innerWidth) * 2 - 1) * 3;
      mouseY = (-(e.clientY / window.innerHeight) * 2 + 1) * 3;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const RADIUS = 1.4;
    const PUSH = 0.012;
    const RETURN = 0.0016;
    const DAMP = 0.9;

    // Pause-aware elapsed time (avoids deprecated THREE.Clock).
    let runStart = performance.now();
    let elapsedBeforePause = 0;

    let raf = 0;
    let running = true;

    const tick = () => {
      const t = (elapsedBeforePause + (performance.now() - runStart)) / 1000;
      const pos = geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < PARTICLES; i++) {
        const i3 = i * 3;
        const cx = pos[i3];
        const cy = pos[i3 + 1];
        const cz = pos[i3 + 2];

        let vx = velocities[i3];
        let vy = velocities[i3 + 1];
        let vz = velocities[i3 + 2];

        // Pointer repulsion (scalar, no allocation)
        const dx = cx - mouseX;
        const dy = cy - mouseY;
        const dz = cz;
        const distSq = dx * dx + dy * dy + dz * dz;
        if (distSq < RADIUS * RADIUS) {
          const dist = Math.sqrt(distSq) || 0.0001;
          const force = ((RADIUS - dist) * PUSH) / dist;
          vx += dx * force;
          vy += dy * force;
          vz += dz * force;
        }

        // Spring back to original
        vx += (original[i3] - cx) * RETURN;
        vy += (original[i3 + 1] - cy) * RETURN;
        vz += (original[i3 + 2] - cz) * RETURN;

        // Damping
        vx *= DAMP;
        vy *= DAMP;
        vz *= DAMP;

        pos[i3] = cx + vx;
        pos[i3 + 1] = cy + vy;
        pos[i3 + 2] = cz + vz;
        velocities[i3] = vx;
        velocities[i3 + 1] = vy;
        velocities[i3 + 2] = vz;
      }
      geometry.attributes.position.needsUpdate = true;

      points.rotation.y = t * 0.05;
      points.rotation.x = Math.sin(t * 0.1) * 0.1;
      renderer.render(scene, camera);

      if (running) raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      runStart = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      if (running) elapsedBeforePause += performance.now() - runStart;
      running = false;
      cancelAnimationFrame(raf);
    };

    raf = requestAnimationFrame(tick);

    // Pause when offscreen
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 }
    );
    io.observe(mount);

    // Pause when tab hidden
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    // Resize
    const onResize = () => {
      const w = mount.clientWidth || window.innerWidth;
      const h = mount.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.position.z = fitZ(w / h);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className={className} aria-hidden="true" />;
}
