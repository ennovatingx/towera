import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { resolveWebglColor } from './resolveWebglColor';

interface AmbientParticlesProps {
  count: number;
  reducedMotion: boolean;
}

/** A single sparse instanced Points field for ambient depth — one draw call regardless of count. */
export default function AmbientParticles({ count, reducedMotion }: AmbientParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const ambientColor = useMemo(() => new THREE.Color(resolveWebglColor('oklch(0.6 0.02 85)')), []);

  const { geometry, basePositions, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const base: THREE.Vector3[] = [];
    const phaseList: number[] = [];

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 13;
      const y = (Math.random() - 0.5) * 13;
      const z = (Math.random() - 0.5) * 5 - 1;
      base.push(new THREE.Vector3(x, y, z));
      phaseList.push(Math.random() * Math.PI * 2);
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return { geometry: geom, basePositions: base, phases: phaseList };
  }, [count]);

  useFrame(({ clock }) => {
    if (reducedMotion) return;
    const points = pointsRef.current;
    if (!points) return;
    const positionAttr = points.geometry.getAttribute('position') as THREE.BufferAttribute;
    const t = clock.elapsedTime;
    for (let i = 0; i < basePositions.length; i++) {
      const base = basePositions[i];
      const phase = phases[i];
      positionAttr.setXYZ(
        i,
        base.x + Math.sin(t * 0.06 + phase) * 0.4,
        base.y + Math.cos(t * 0.05 + phase * 1.4) * 0.4,
        base.z + Math.sin(t * 0.04 + phase * 0.6) * 0.3
      );
    }
    positionAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.035}
        color={ambientColor}
        transparent
        opacity={0.35}
        sizeAttenuation
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}
