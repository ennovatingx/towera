import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

export interface ConnectionEdge {
  id: string;
  from: [number, number, number];
  to: [number, number, number];
  color: string;
  /** 0-1: how prominent this edge should look, driven by whether it touches the active/hovered node. */
  brightness: number;
}

interface ConnectionLinesProps {
  edges: ConnectionEdge[];
  reducedMotion: boolean;
}

const PARTICLES_PER_EDGE = 3;
const FLOW_SPEED = 0.15;

/**
 * Renders every connection as a thin glowing line (drei <Line>) plus a single
 * shared, instanced <Points> buffer carrying all flow particles across every
 * edge — one draw call for the particles regardless of edge count, satisfying
 * "instanced particles" without hundreds of separate objects.
 */
export default function ConnectionLines({ edges, reducedMotion }: ConnectionLinesProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const particleData = useMemo(() => {
    const starts: THREE.Vector3[] = [];
    const ends: THREE.Vector3[] = [];
    const colors: THREE.Color[] = [];
    const offsets: number[] = [];
    const brightness: number[] = [];

    for (const edge of edges) {
      const start = new THREE.Vector3(...edge.from);
      const end = new THREE.Vector3(...edge.to);
      const color = new THREE.Color(edge.color);
      for (let i = 0; i < PARTICLES_PER_EDGE; i++) {
        starts.push(start);
        ends.push(end);
        colors.push(color);
        offsets.push(i / PARTICLES_PER_EDGE);
        brightness.push(edge.brightness);
      }
    }

    const count = starts.length;
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(count * 3), 3));

    return { geometry, starts, ends, colors, offsets, brightness };
  }, [edges]);

  useFrame(({ clock }) => {
    const points = pointsRef.current;
    if (!points) return;
    const positionAttr = points.geometry.getAttribute('position') as THREE.BufferAttribute;
    const colorAttr = points.geometry.getAttribute('color') as THREE.BufferAttribute;
    const { starts, ends, colors, offsets, brightness } = particleData;

    const t = reducedMotion ? 0 : clock.elapsedTime * FLOW_SPEED;
    for (let i = 0; i < starts.length; i++) {
      const progress = reducedMotion ? offsets[i] : (t + offsets[i]) % 1;
      positionAttr.setXYZ(
        i,
        THREE.MathUtils.lerp(starts[i].x, ends[i].x, progress),
        THREE.MathUtils.lerp(starts[i].y, ends[i].y, progress),
        THREE.MathUtils.lerp(starts[i].z, ends[i].z, progress)
      );
      const c = colors[i];
      const b = brightness[i];
      colorAttr.setXYZ(i, c.r * b, c.g * b, c.b * b);
    }
    positionAttr.needsUpdate = true;
    colorAttr.needsUpdate = true;
  });

  return (
    <>
      {edges.map((edge) => (
        <Line
          key={edge.id}
          points={[edge.from, edge.to]}
          color={edge.color}
          lineWidth={1 + edge.brightness * 1.5}
          transparent
          opacity={0.12 + edge.brightness * 0.55}
        />
      ))}
      <points ref={pointsRef} geometry={particleData.geometry}>
        <pointsMaterial size={0.06} vertexColors sizeAttenuation transparent depthWrite={false} toneMapped={false} />
      </points>
    </>
  );
}
