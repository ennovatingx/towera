import { useCallback } from 'react';
import { useHeroUniverse } from './heroUniverseContext';

// OrbitControls' dollyIn/dollyOut expect a scale factor < 1 (mirroring its own internal wheel-zoom
// convention, getZoomScale() = 0.95^zoomSpeed) — passing a factor > 1 inverts both directions, since
// dollyIn multiplies the internal scale by it (radius *= scale) while dollyOut divides by it.
const ZOOM_SCALE = 0.8;

/** Explicit zoom in/out control — the primary way to zoom now that wheel/touch-pinch don't hijack page scroll. */
export default function ZoomControls() {
  const { controlsRef, panelOpen, panelExpanded } = useHeroUniverse();

  const dollyIn = useCallback(() => {
    controlsRef.current?.dollyIn(ZOOM_SCALE);
  }, [controlsRef]);

  const dollyOut = useCallback(() => {
    controlsRef.current?.dollyOut(ZOOM_SCALE);
  }, [controlsRef]);

  return (
    <div
      className={`absolute left-4 z-[200] flex flex-row sm:flex-col overflow-hidden rounded-xl border border-white/15 bg-foreground-950/70 backdrop-blur-sm transition-[bottom,opacity] duration-300 ease-out ${
        panelOpen ? 'bottom-[calc(45vh+16px)]' : 'bottom-4'
      } ${panelExpanded ? 'opacity-0 pointer-events-none sm:opacity-100 sm:pointer-events-auto' : 'opacity-100'} sm:bottom-8 sm:left-8`}
    >
      <button
        type="button"
        onClick={dollyIn}
        aria-label="Zoom in"
        className="flex h-9 w-9 items-center justify-center text-white/80 hover:bg-white/10 active:scale-95 transition-all duration-150 cursor-pointer"
      >
        <i className="ri-add-line text-base" />
      </button>
      <div className="w-px h-9 sm:w-full sm:h-px bg-white/10" />
      <button
        type="button"
        onClick={dollyOut}
        aria-label="Zoom out"
        className="flex h-9 w-9 items-center justify-center text-white/80 hover:bg-white/10 active:scale-95 transition-all duration-150 cursor-pointer"
      >
        <i className="ri-subtract-line text-base" />
      </button>
    </div>
  );
}
