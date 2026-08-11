import { useEffect, useRef, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { dampTowards } from '@/lib/heroUniverseMath';
import { useHeroUniverse } from './heroUniverseContext';

/** Shared with ZoomControls so its +/- buttons clamp to the same range OrbitControls enforces. */
export const MIN_DISTANCE = 6;
export const MAX_DISTANCE = 30;

const PINCH_ZOOM_SPEED = 0.006;

interface CameraRigProps {
  containerRef: RefObject<HTMLDivElement | null>;
}

/**
 * Lives inside <Canvas>. Renders drei's OrbitControls for free rotate (any
 * axis, no polar/azimuth limits) around the hub, scoped to the wrapping
 * container div rather than the bare canvas — drei's <Html> labels portal as
 * DOM siblings of the canvas, so a listener on the canvas alone would miss
 * drags that start on a label.
 *
 * Wheel/touch zoom is deliberately left OFF on OrbitControls itself
 * (`enableZoom={false}`): the canvas is full-bleed across the whole viewport,
 * so letting it capture wheel events would trap the page unable to scroll
 * past the hero. Zoom instead comes from pinch (tracked here, driving
 * `dollyIn`/`dollyOut` directly) and the explicit Zoom +/- control.
 *
 * On top of that, a per-frame lerp eases `controls.target` toward whatever
 * `requestActivate` last set — OrbitControls itself only supports snapping
 * the target, and clicking a node should glide the orbit pivot onto it.
 */
export default function CameraRig({ containerRef }: CameraRigProps) {
  const { controlsRef, orbitStateRef, reducedMotion } = useHeroUniverse();
  const lastPinchDistRef = useRef<number | null>(null);

  useEffect(() => {
    const dom = containerRef.current;
    if (!dom) return;

    const pointers = new Map<number, { x: number; y: number }>();
    let lastPanPos: { x: number; y: number } | null = null;

    function pointerPos(e: PointerEvent) {
      return { x: e.clientX, y: e.clientY };
    }

    function handlePointerDown(e: PointerEvent) {
      pointers.set(e.pointerId, pointerPos(e));
      if (pointers.size === 1) {
        lastPanPos = pointerPos(e);
        orbitStateRef.current.dragDistance = 0;
      } else if (pointers.size === 2) {
        const pts = Array.from(pointers.values());
        lastPinchDistRef.current = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      }
    }

    function handlePointerMove(e: PointerEvent) {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, pointerPos(e));

      if (pointers.size === 1 && lastPanPos) {
        const pos = pointerPos(e);
        orbitStateRef.current.dragDistance += Math.hypot(pos.x - lastPanPos.x, pos.y - lastPanPos.y);
        lastPanPos = pos;
      } else if (pointers.size === 2 && lastPinchDistRef.current !== null) {
        const pts = Array.from(pointers.values());
        const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        const delta = dist - lastPinchDistRef.current;
        const controls = controlsRef.current;
        if (controls && delta !== 0) {
          // dollyIn/dollyOut expect a scale factor < 1 — see ZoomControls.tsx for why.
          const scale = 1 / (1 + Math.abs(delta) * PINCH_ZOOM_SPEED);
          if (delta > 0) controls.dollyIn(scale); // fingers spreading apart -> zoom in
          else controls.dollyOut(scale); // fingers pinching together -> zoom out
        }
        lastPinchDistRef.current = dist;
      }
    }

    function handlePointerUp(e: PointerEvent) {
      pointers.delete(e.pointerId);
      if (pointers.size < 2) lastPinchDistRef.current = null;
      if (pointers.size === 0) lastPanPos = null;
    }

    dom.addEventListener('pointerdown', handlePointerDown);
    dom.addEventListener('pointermove', handlePointerMove);
    dom.addEventListener('pointerup', handlePointerUp);
    dom.addEventListener('pointercancel', handlePointerUp);
    dom.addEventListener('pointerleave', handlePointerUp);

    return () => {
      dom.removeEventListener('pointerdown', handlePointerDown);
      dom.removeEventListener('pointermove', handlePointerMove);
      dom.removeEventListener('pointerup', handlePointerUp);
      dom.removeEventListener('pointercancel', handlePointerUp);
      dom.removeEventListener('pointerleave', handlePointerUp);
    };
  }, [containerRef, controlsRef, orbitStateRef]);

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!controls) return;
    const desired = orbitStateRef.current.desiredTarget;
    const smoothing = reducedMotion ? 30 : 4.5;
    controls.target.set(
      dampTowards(controls.target.x, desired.x, smoothing, delta),
      dampTowards(controls.target.y, desired.y, smoothing, delta),
      dampTowards(controls.target.z, desired.z, smoothing, delta)
    );
    controls.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      domElement={containerRef.current ?? undefined}
      makeDefault
      enableDamping={!reducedMotion}
      dampingFactor={0.08}
      enableRotate
      rotateSpeed={0.6}
      enablePan={false}
      enableZoom={false}
      minDistance={MIN_DISTANCE}
      maxDistance={MAX_DISTANCE}
      minPolarAngle={0}
      maxPolarAngle={Math.PI}
    />
  );
}
