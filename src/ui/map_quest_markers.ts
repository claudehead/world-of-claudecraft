// Map markers for the player's tracked quest (issue #928). Thin host-agnostic
// wrapper over the sim resolver: returns the objective location(s) that fall in
// the currently-shown zone band, ready for the HUD to draw as pins / search
// circles. Pure data — the HUD owns the canvas drawing.
import { questObjectiveLocations, type ObjectiveLocation } from '../sim/quests/quest_objective_locator';

export type QuestMapMarker = ObjectiveLocation;

export function trackedQuestMapMarkers(
  questId: string | null,
  counts: readonly number[] | undefined,
  zMin: number,
  zMax: number,
): QuestMapMarker[] {
  if (!questId) return [];
  return questObjectiveLocations(questId, counts).filter((m) => m.z >= zMin && m.z < zMax);
}

/** The tracked quest's objective location nearest a point (for the minimap
 *  direction arrow), with its planar distance, or null if none resolve. */
export function nearestQuestObjective(
  questId: string | null,
  counts: readonly number[] | undefined,
  fromX: number,
  fromZ: number,
): (QuestMapMarker & { dist: number }) | null {
  if (!questId) return null;
  let best: (QuestMapMarker & { dist: number }) | null = null;
  for (const m of questObjectiveLocations(questId, counts)) {
    const dist = Math.hypot(m.x - fromX, m.z - fromZ);
    if (!best || dist < best.dist) best = { ...m, dist };
  }
  return best;
}
