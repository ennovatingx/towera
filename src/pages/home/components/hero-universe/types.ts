export type DomainStatus = 'active' | 'planned';

export interface DomainMetrics {
  languages?: string;
  records?: string;
  audioHours?: string;
  qualityScore?: string;
}

export interface DomainAction {
  label: string;
  href: string;
}

/** A possible (not necessarily shipped) use case for a domain's data — surfaced on node hover and in the detail panel. */
export interface DomainApplication {
  /** Remix Icon class name, e.g. "ri-mic-line". */
  icon: string;
  label: string;
  description: string;
}

export interface DomainNode {
  id: string;
  name: string;
  category: string;
  /** Remix Icon class name, e.g. "ri-translate-2". */
  icon: string;
  /** oklch() color string — used for both the WebGL emissive material and DOM (Html label / tooltip / panel) accents. */
  color: string;
  description: string;
  /** x,y,z each in [-1,1] — a point on (or at the center of, for the hub) a unit sphere, scaled to world units by `toWorldPosition`. */
  position: { x: number; y: number; z: number };
  status: DomainStatus;
  /** Only populated for status: 'active' nodes — never fabricated for 'planned' ones. */
  metrics: DomainMetrics | null;
  dataTypes: string[];
  license: string | null;
  /** Only populated for status: 'active' nodes. */
  actions: DomainAction[];
  /** Ids of connected nodes — treated as an undirected adjacency list (deduped at render time). */
  connections: string[];
  /** Up to 6 possible applications of this domain's data — shown on hover and in the detail panel. */
  applications: DomainApplication[];
}

/** Visual prominence of a node relative to the current active node, via BFS over `connections`. */
export type NodeVisualState = 'active' | 'direct' | 'indirect' | 'dim';
