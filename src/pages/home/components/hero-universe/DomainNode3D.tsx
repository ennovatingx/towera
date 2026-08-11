import { useMemo, useRef } from 'react';
import { flushSync } from 'react-dom';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { dampTowards, toWorldPosition } from '@/lib/heroUniverseMath';
import type { DomainNode, NodeVisualState } from './types';
import { useHeroUniverse } from './heroUniverseContext';
import { resolveWebglColor } from './resolveWebglColor';

interface DomainNode3DProps {
  node: DomainNode;
  visualState: NodeVisualState;
  /** Per-node phase offset (radians) so floating motion doesn't sync across nodes. */
  phase: number;
}

const CORE_RADIUS = 0.22;
// Invisible, larger raycast target — the visible sphere alone is too small a hit area for the
// (much bigger, legible) DOM badge sitting on top of it, now that hover/click are raycast-only.
const HIT_RADIUS = 0.45;
const APPLICATION_RING_RADIUS = 1.3;
const MAX_APPLICATIONS_SHOWN = 6;
// drei <Html> scales content by distanceFactor / (cameraDistance * ~0.93) — bumped well up from the old
// flat-scene value of 8 so labels stay legible now that nodes sit much further from the camera on average
// (real 3D depth spread, bigger default camera distance) instead of a near-flat disc close to the lens.
const LABEL_DISTANCE_FACTOR = 18;

const EMISSIVE_BY_STATE: Record<NodeVisualState, number> = {
  active: 2.6,
  direct: 1.5,
  indirect: 0.9,
  dim: 0.35,
};

const SCALE_BY_STATE: Record<NodeVisualState, number> = {
  active: 1.35,
  direct: 1.05,
  indirect: 0.9,
  dim: 0.75,
};

export default function DomainNode3D({ node, visualState, phase }: DomainNode3DProps) {
  const { hoveredId, setHoveredId, requestActivate, reducedMotion, supportsHover } = useHeroUniverse();
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  const basePosition = useMemo(() => toWorldPosition(node.position), [node.position]);
  const color = useMemo(() => new THREE.Color(resolveWebglColor(node.color)), [node.color]);
  const isHovered = hoveredId === node.id;

  const applicationRingItems = useMemo(() => {
    const applications = node.applications.slice(0, MAX_APPLICATIONS_SHOWN);
    return applications.map((application, i) => {
      const angle = (i / applications.length) * Math.PI * 2 - Math.PI / 2;
      const offset: [number, number, number] = [
        Math.cos(angle) * APPLICATION_RING_RADIUS,
        Math.sin(angle) * APPLICATION_RING_RADIUS,
        0,
      ];
      return { application, offset };
    });
  }, [node.applications]);

  useFrame(({ clock }, delta) => {
    const group = groupRef.current;
    if (!group) return;

    if (!reducedMotion) {
      const t = clock.elapsedTime;
      group.position.set(
        basePosition[0] + Math.sin(t * 0.4 + phase) * 0.08,
        basePosition[1] + Math.cos(t * 0.35 + phase * 1.3) * 0.08,
        basePosition[2] + Math.sin(t * 0.3 + phase * 0.7) * 0.05
      );
    } else {
      group.position.set(basePosition[0], basePosition[1], basePosition[2]);
    }

    const targetScale = SCALE_BY_STATE[visualState] * (isHovered ? 1.15 : 1);
    const nextScale = dampTowards(group.scale.x, targetScale, 8, delta);
    group.scale.setScalar(nextScale);

    if (materialRef.current) {
      const targetEmissive = EMISSIVE_BY_STATE[visualState] * (isHovered ? 1.4 : 1);
      materialRef.current.emissiveIntensity = dampTowards(
        materialRef.current.emissiveIntensity,
        targetEmissive,
        8,
        delta
      );
    }
  });

  return (
    <group
      ref={groupRef}
      position={basePosition}
      onPointerOver={(e) => {
        e.stopPropagation();
        // r3f's pointer-hover dispatch runs synced to its own render loop, outside React's normal
        // event-scheduling path — a plain setState here is silently dropped (confirmed: the setter runs
        // with the right value, but nothing ever re-renders). flushSync forces it through immediately,
        // the same fix used for state updates from requestAnimationFrame-driven external event sources.
        if (supportsHover) flushSync(() => setHoveredId(node.id));
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        if (supportsHover) {
          flushSync(() => setHoveredId((current) => (current === node.id ? null : current)));
        }
        document.body.style.cursor = 'auto';
      }}
      onClick={(e) => {
        e.stopPropagation();
        requestActivate(node.id);
      }}
    >
      <mesh>
        <sphereGeometry args={[CORE_RADIUS, 24, 24]} />
        <meshStandardMaterial
          ref={materialRef}
          color={color}
          emissive={color}
          emissiveIntensity={EMISSIVE_BY_STATE[visualState]}
          toneMapped={false}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[HIT_RADIUS, 12, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* pointer-events: none + no onClick/onMouseEnter here — React's mouseenter/mouseleave synthesis
          is unreliable across a drei <Html> portal boundary (confirmed: native DOM events and browser
          :hover both fire correctly, but React's synthetic handler never ran, so hoveredId never
          updated). Hover/click are handled entirely by the r3f group's onPointerOver/onPointerOut/
          onClick above, which raycast against the actual mesh and don't have this issue. */}
      <Html center distanceFactor={LABEL_DISTANCE_FACTOR} zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
        <div
          className={`flex flex-col items-center gap-1.5 transition-opacity duration-300 ${
            visualState === 'dim' ? 'opacity-40' : 'opacity-100'
          }`}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center border-2 shadow-[0_0_0_3px_rgba(5,5,8,0.65)]"
            style={{ borderColor: node.color, backgroundColor: 'rgba(8, 7, 10, 0.82)' }}
          >
            <i className={`${node.icon} text-base`} style={{ color: node.color }} />
          </div>
          <span className="text-sm font-semibold text-white whitespace-nowrap drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
            {node.name}
          </span>
        </div>
      </Html>

      {/* Mounted only while hovered (not always-mounted + CSS-hidden) — with 10 nodes x 6 applications,
          always-mounting every chip pushed drei's <Html> portal count into the dozens simultaneously,
          and past a certain count some portals silently failed to commit at all (reproduced: dropping
          to ~20 always-mounted Html elements made every node's label render correctly again). */}
      {supportsHover &&
        isHovered &&
        applicationRingItems.map(({ application, offset }) => (
          <group key={application.label} position={offset}>
            <Html center distanceFactor={LABEL_DISTANCE_FACTOR} zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
              <div
                className="flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 backdrop-blur-sm bg-foreground-950/90 whitespace-nowrap"
                style={{ borderColor: `color-mix(in oklch, ${node.color} 50%, transparent)` }}
              >
                <i className={`${application.icon} text-xs`} style={{ color: node.color }} />
                <span className="text-[11px] font-medium text-white">{application.label}</span>
              </div>
            </Html>
          </group>
        ))}
    </group>
  );
}
