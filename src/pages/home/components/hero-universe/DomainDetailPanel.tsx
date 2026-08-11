import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { getDomainNode, DEFAULT_ACTIVE_NODE_ID } from './domainData';
import { useHeroUniverse } from './heroUniverseContext';
import type { DomainNode } from './types';

/** Downward drag distance (px) past which releasing dismisses the mobile sheet instead of snapping back. */
const DISMISS_THRESHOLD_PX = 100;
const SNAP_TRANSITION_MS = 300;

interface MetricProps {
  label: string;
  value: string;
}

function Metric({ label, value }: MetricProps) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 px-3 py-2.5">
      <p className="text-lg font-heading font-semibold text-white leading-none mb-1">{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-white/40">{label}</p>
    </div>
  );
}

const FALLBACK_NODE = getDomainNode(DEFAULT_ACTIVE_NODE_ID)!;

export default function DomainDetailPanel() {
  const { activeId, panelOpen, setPanelOpen } = useHeroUniverse();
  const node = getDomainNode(activeId) ?? FALLBACK_NODE;

  const [displayNode, setDisplayNode] = useState<DomainNode>(node);
  const [visible, setVisible] = useState(true);

  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartYRef = useRef<number | null>(null);

  useEffect(() => {
    if (node.id === displayNode.id) return;
    setVisible(false);
    const timeout = setTimeout(() => {
      setDisplayNode(node);
      setVisible(true);
    }, 220);
    return () => clearTimeout(timeout);
  }, [node, displayNode.id]);

  const handleDragStart = (e: ReactPointerEvent<HTMLDivElement>) => {
    dragStartYRef.current = e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleDragMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const startY = dragStartYRef.current;
    const sheet = sheetRef.current;
    if (startY === null || !sheet) return;
    const delta = Math.max(0, e.clientY - startY);
    sheet.style.transition = 'none';
    sheet.style.transform = `translateY(${delta}px)`;
  };

  const handleDragEnd = (e: ReactPointerEvent<HTMLDivElement>) => {
    const startY = dragStartYRef.current;
    const sheet = sheetRef.current;
    dragStartYRef.current = null;
    if (startY === null || !sheet) return;

    const shouldClose = e.clientY - startY > DISMISS_THRESHOLD_PX;
    sheet.style.transition = `transform ${SNAP_TRANSITION_MS}ms cubic-bezier(0.32, 0.72, 0, 1)`;
    sheet.style.transform = shouldClose ? 'translateY(110%)' : 'translateY(0)';

    window.setTimeout(() => {
      if (shouldClose) setPanelOpen(false);
      sheet.style.transition = '';
      sheet.style.transform = '';
    }, SNAP_TRANSITION_MS);
  };

  const metricEntries = displayNode.metrics
    ? ([
        ['Languages', displayNode.metrics.languages],
        ['Verified Records', displayNode.metrics.records],
        ['Audio Hours', displayNode.metrics.audioHours],
        ['Quality Score', displayNode.metrics.qualityScore],
      ] as const)
    : [];

  return (
    <div
      ref={sheetRef}
      className={`absolute z-[200] inset-x-0 bottom-0 max-h-[45vh] rounded-t-3xl border-t border-white/10 bg-foreground-950/85 backdrop-blur-xl p-6 overflow-y-auto pointer-events-auto transition-transform duration-300 ease-out ${
        panelOpen ? 'translate-y-0' : 'translate-y-[110%]'
      } sm:translate-y-0 sm:inset-x-auto sm:right-0 sm:top-0 sm:bottom-0 sm:max-h-none sm:w-80 sm:rounded-none sm:border-t-0 sm:border-l sm:p-8 md:w-96`}
      aria-live="polite"
    >
      <div
        onPointerDown={handleDragStart}
        onPointerMove={handleDragMove}
        onPointerUp={handleDragEnd}
        onPointerCancel={handleDragEnd}
        className="sm:hidden -mx-6 -mt-6 mb-3 px-6 pt-3 pb-2 flex justify-center cursor-grab active:cursor-grabbing touch-none"
      >
        <span className="w-10 h-1.5 rounded-full bg-white/25" />
      </div>

      <button
        type="button"
        onClick={() => setPanelOpen(false)}
        aria-label="Close details"
        className="sm:hidden absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/10 active:scale-95 transition-all duration-150 cursor-pointer"
      >
        <i className="ri-close-line text-lg" />
      </button>

      <div className={`transition-all duration-300 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
        <span
          className="text-[10px] font-semibold uppercase tracking-[0.2em]"
          style={{ color: displayNode.color }}
        >
          {displayNode.status === 'active' ? 'Data Domain' : 'Planned Domain'}
        </span>
        <h3 className="font-heading text-2xl font-semibold text-white mt-2 mb-4">{displayNode.name}</h3>
        <p className="text-sm text-white/70 leading-relaxed mb-6">{displayNode.description}</p>

        {displayNode.status === 'active' && metricEntries.length > 0 ? (
          <div className="grid grid-cols-2 gap-2.5 mb-6">
            {metricEntries.map(
              ([label, value]) => value && <Metric key={label} label={label} value={value} />
            )}
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/50 mb-6">
            <i className="ri-time-line" />
            Not yet collecting data
          </div>
        )}

        <div className="mb-6">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40 mb-2">Data Types</p>
          <div className="flex flex-wrap gap-1.5">
            {displayNode.dataTypes.map((type) => (
              <span
                key={type}
                className={`px-2.5 py-1 rounded-full text-[11px] border ${
                  displayNode.status === 'active' ? 'border-white/20 text-white/80' : 'border-white/10 text-white/40'
                }`}
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        {displayNode.applications.length > 0 && (
          <div className="mb-6">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40 mb-2">
              Possible Applications
            </p>
            <div className="flex flex-col gap-2">
              {displayNode.applications.map((application) => (
                <div
                  key={application.label}
                  className="flex items-start gap-2.5 rounded-xl bg-white/5 border border-white/10 px-3 py-2.5"
                >
                  <div
                    className="w-7 h-7 shrink-0 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `color-mix(in oklch, ${displayNode.color} 20%, transparent)` }}
                  >
                    <i className={`${application.icon} text-xs`} style={{ color: displayNode.color }} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white/90 mb-0.5">{application.label}</p>
                    <p className="text-[11px] text-white/50 leading-snug">{application.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {displayNode.license && (
          <div className="mb-6">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40 mb-1">License</p>
            <p className="text-sm text-white/70">{displayNode.license}</p>
          </div>
        )}

        {displayNode.actions.length > 0 && (
          <div className="flex flex-col gap-2">
            {displayNode.actions.map((action) => (
              <a
                key={action.href}
                href={action.href}
                className="text-center px-4 py-2.5 rounded-full text-sm font-medium bg-white text-foreground-950 hover:bg-white/90 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                {action.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
