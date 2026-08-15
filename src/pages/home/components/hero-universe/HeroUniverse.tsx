import { useCallback, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useInViewport } from '@/hooks/useInViewport';
import { toWorldPosition } from '@/lib/heroUniverseMath';
import { DEFAULT_ACTIVE_NODE_ID, getDomainNode } from './domainData';
import { HeroUniverseContext, type OrbitState, type HeroUniverseContextValue } from './heroUniverseContext';
import Scene from './Scene';
import DomainDetailPanel from './DomainDetailPanel';
import ZoomControls from './ZoomControls';

const CLICK_SUPPRESS_PX = 6;

export default function HeroUniverse() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { ref: viewportRef, inView } = useInViewport<HTMLDivElement>({ rootMargin: '300px 0px' });

  const [activeId, setActiveId] = useState(DEFAULT_ACTIVE_NODE_ID);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelExpanded, setPanelExpanded] = useState(false);
  const [reducedMotion] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false
  );
  const [particleCount] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth < 768 ? 70 : 180
  );
  const [supportsHover] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(hover: hover) and (pointer: fine)').matches : true
  );
  // Mobile starts further back so the (now much bigger) node sphere clears the compact corner text block
  // without needing to shift the orbit pivot off the hub — an offset pivot would make rotation swing
  // around empty space instead of the network's own center.
  const [initialDistance] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth < 640 ? 27 : 16
  );

  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const orbitStateRef = useRef<OrbitState>({
    desiredTarget: { x: 0, y: 0, z: 0 },
    dragDistance: 0,
  });

  const requestActivate = useCallback((id: string) => {
    if (orbitStateRef.current.dragDistance > CLICK_SUPPRESS_PX) return;
    const node = getDomainNode(id);
    if (!node) return;
    setActiveId(id);
    setPanelOpen(true);
    const [x, y, z] = toWorldPosition(node.position);
    orbitStateRef.current.desiredTarget = { x, y, z };
  }, []);

  const contextValue = useMemo<HeroUniverseContextValue>(
    () => ({
      activeId,
      hoveredId,
      setHoveredId,
      requestActivate,
      controlsRef,
      orbitStateRef,
      reducedMotion,
      supportsHover,
      panelOpen,
      setPanelOpen,
      panelExpanded,
      setPanelExpanded,
    }),
    [activeId, hoveredId, requestActivate, reducedMotion, supportsHover, panelOpen, panelExpanded]
  );

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node;
      viewportRef.current = node;
    },
    [viewportRef]
  );

  return (
    <div ref={setRefs} className="absolute inset-0">
      <HeroUniverseContext.Provider value={contextValue}>
        <Canvas
          style={{ position: 'absolute', inset: 0 }}
          camera={{ fov: 50, position: [0, 0, initialDistance], near: 0.1, far: 80 }}
          dpr={[1, 2]}
          frameloop={inView ? 'always' : 'demand'}
          gl={{ antialias: true, alpha: true }}
        >
          <Scene containerRef={containerRef} particleCount={particleCount} />
        </Canvas>
        <DomainDetailPanel />
        <ZoomControls />
      </HeroUniverseContext.Provider>
    </div>
  );
}
