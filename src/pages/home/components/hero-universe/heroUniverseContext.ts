import { createContext, useContext, type Dispatch, type RefObject, type SetStateAction } from 'react';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

export interface OrbitState {
  /** World-space point the camera orbits around — `requestActivate` sets this, CameraRig lerps `controls.target` toward it each frame. */
  desiredTarget: { x: number; y: number; z: number };
  /** Accumulated pointer-movement distance (px) for the current drag gesture, used to suppress accidental clicks after a rotate. */
  dragDistance: number;
}

export interface HeroUniverseContextValue {
  activeId: string;
  hoveredId: string | null;
  setHoveredId: Dispatch<SetStateAction<string | null>>;
  /** Sets the active node unless the user was mid-drag; also nudges the orbit target toward it and opens the detail panel. */
  requestActivate: (id: string) => void;
  /** Whether the detail panel is open — only meaningful on mobile (a dismissible bottom sheet); always visible as a sidebar on larger screens regardless of this value. */
  panelOpen: boolean;
  setPanelOpen: Dispatch<SetStateAction<boolean>>;
  /** Whether the mobile sheet is drag-expanded to its tall (~90vh) snap point rather than its default half-height one. Ignored on larger screens. */
  panelExpanded: boolean;
  setPanelExpanded: Dispatch<SetStateAction<boolean>>;
  /** The live OrbitControls instance — used by CameraRig's target-lerp and by ZoomControls' dolly buttons. */
  controlsRef: RefObject<OrbitControlsImpl | null>;
  orbitStateRef: RefObject<OrbitState>;
  reducedMotion: boolean;
  /** False on touch-only devices — gates the hover tooltip, since taps leave a "stuck" synthetic hover with no matching leave event. */
  supportsHover: boolean;
}

export const HeroUniverseContext = createContext<HeroUniverseContextValue | null>(null);

export function useHeroUniverse(): HeroUniverseContextValue {
  const ctx = useContext(HeroUniverseContext);
  if (!ctx) throw new Error('useHeroUniverse must be used within HeroUniverse');
  return ctx;
}
