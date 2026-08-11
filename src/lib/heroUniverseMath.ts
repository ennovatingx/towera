import type { DomainNode, NodeVisualState } from '@/pages/home/components/hero-universe/types';

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Frame-rate independent exponential smoothing toward a target value — the
 * standard technique for smooth camera easing without a tweening library.
 * `smoothingFactor` is roughly "how many times per second the gap halves";
 * higher = snappier.
 */
export function dampTowards(current: number, target: number, smoothingFactor: number, deltaSeconds: number): number {
  return lerp(current, target, 1 - Math.exp(-smoothingFactor * deltaSeconds));
}

/** Each normalized x/y/z axis in [-1,1] maps to +/- this many world units — uniform so the node sphere reads as a true 3D shape from every camera angle. */
export const WORLD_SCALE = 5.5;

export function toWorldPosition(position: { x: number; y: number; z: number }): [number, number, number] {
  return [position.x * WORLD_SCALE, position.y * WORLD_SCALE, position.z * WORLD_SCALE];
}

/**
 * Classifies every node's visual prominence relative to the active node via
 * a 2-hop BFS over the (undirected) `connections` adjacency: the active node
 * itself, its direct neighbors, their neighbors ("indirect"), and everything
 * else ("dim"). Drives both the 3D node materials and the DOM detail panel.
 */
export function computeNodeVisualStates(nodes: DomainNode[], activeId: string): Map<string, NodeVisualState> {
  const adjacency = new Map<string, Set<string>>();
  const ensure = (id: string): Set<string> => {
    let set = adjacency.get(id);
    if (!set) {
      set = new Set();
      adjacency.set(id, set);
    }
    return set;
  };

  for (const node of nodes) {
    for (const targetId of node.connections) {
      ensure(node.id).add(targetId);
      ensure(targetId).add(node.id);
    }
  }

  const states = new Map<string, NodeVisualState>();
  states.set(activeId, 'active');

  const direct = adjacency.get(activeId) ?? new Set<string>();
  for (const id of direct) {
    if (!states.has(id)) states.set(id, 'direct');
  }

  const indirect = new Set<string>();
  for (const id of direct) {
    for (const neighbor of adjacency.get(id) ?? []) {
      if (!states.has(neighbor)) indirect.add(neighbor);
    }
  }
  for (const id of indirect) {
    states.set(id, 'indirect');
  }

  for (const node of nodes) {
    if (!states.has(node.id)) states.set(node.id, 'dim');
  }

  return states;
}
