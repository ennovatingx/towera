import { useMemo, type RefObject } from 'react';
import { Line } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { computeNodeVisualStates, toWorldPosition } from '@/lib/heroUniverseMath';
import type { NodeVisualState } from './types';
import { DOMAIN_NODES, getUniqueEdges, getDomainNode } from './domainData';
import { NIGERIA_OUTLINE_POINTS } from './NigeriaOutline';
import { resolveWebglColor } from './resolveWebglColor';
import { useHeroUniverse } from './heroUniverseContext';
import CameraRig from './CameraRig';
import DomainNode3D from './DomainNode3D';
import ConnectionLines, { type ConnectionEdge } from './ConnectionLines';
import AmbientParticles from './AmbientParticles';

const STATE_WEIGHT: Record<NodeVisualState, number> = { active: 1, direct: 0.55, indirect: 0.3, dim: 0.12 };
// Pushed well behind the node sphere (radius ~WORLD_SCALE) so it reads as a distant backdrop rather than
// clipping through the network — it'll still appear edge-on from some orbit angles, which is expected for
// a flat reference plane in a freely-rotatable 3D scene.
const BACKDROP_Z = -8.5;

interface SceneProps {
  containerRef: RefObject<HTMLDivElement | null>;
  particleCount: number;
}

export default function Scene({ containerRef, particleCount }: SceneProps) {
  const { activeId, hoveredId, reducedMotion } = useHeroUniverse();

  const visualStates = useMemo(() => computeNodeVisualStates(DOMAIN_NODES, activeId), [activeId]);

  const edges = useMemo<ConnectionEdge[]>(() => {
    return getUniqueEdges().map(([fromId, toId]) => {
      const fromNode = getDomainNode(fromId)!;
      const toNode = getDomainNode(toId)!;
      const stateA = visualStates.get(fromId) ?? 'dim';
      const stateB = visualStates.get(toId) ?? 'dim';
      let brightness = Math.max(STATE_WEIGHT[stateA], STATE_WEIGHT[stateB]);
      if (hoveredId && (fromId === hoveredId || toId === hoveredId)) {
        brightness = Math.max(brightness, 0.9);
      }
      const color = new THREE.Color(resolveWebglColor(fromNode.color)).lerp(
        new THREE.Color(resolveWebglColor(toNode.color)),
        0.5
      );

      return {
        id: `${fromId}::${toId}`,
        from: toWorldPosition(fromNode.position),
        to: toWorldPosition(toNode.position),
        color: `#${color.getHexString()}`,
        brightness,
      };
    });
  }, [visualStates, hoveredId]);

  const backdropPoints = useMemo<Array<[number, number, number]>>(
    () => NIGERIA_OUTLINE_POINTS.map(([x, y]) => toWorldPosition({ x, y, z: 0 })).map(([x, y]) => [x, y, BACKDROP_Z]),
    []
  );

  return (
    <>
      <CameraRig containerRef={containerRef} />

      <ambientLight intensity={0.35} />
      <pointLight position={[0, 0, 10]} intensity={0.6} color="#fff4e0" />

      <Line points={backdropPoints} color="#3a3226" lineWidth={1.25} transparent opacity={0.5} />

      <AmbientParticles count={particleCount} reducedMotion={reducedMotion} />

      <ConnectionLines edges={edges} reducedMotion={reducedMotion} />

      {DOMAIN_NODES.map((node, index) => (
        <DomainNode3D
          key={node.id}
          node={node}
          visualState={visualStates.get(node.id) ?? 'dim'}
          phase={index * 1.3}
        />
      ))}

      <EffectComposer>
        <Bloom luminanceThreshold={0.25} luminanceSmoothing={0.4} intensity={0.9} mipmapBlur radius={0.6} />
      </EffectComposer>
    </>
  );
}
