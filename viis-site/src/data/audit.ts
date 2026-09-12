/**
 * Single source of truth for the free audit's point count. It appears on
 * its own — in metas, the subhead — in places that don't list every item,
 * so it would otherwise drift from Audit.astro's freeGroups whenever that
 * list changes. The category lists themselves stay inline in Audit.astro:
 * they render in exactly one place, so a shared module would only add
 * indirection there.
 *
 * viis-site/api deploys as an isolated package (Azure Static Web Apps
 * builds api_location on its own; nothing outside it reaches the deployed
 * function), so api/src/lib/templates.ts cannot import this and keeps its
 * own literal, updated by hand — see the comment there.
 */
export const AUDIT_POINT_COUNT = 15;
