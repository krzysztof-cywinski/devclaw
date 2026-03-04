/**
 * roles/types.ts — Type definitions for the role registry.
 *
 * RoleConfig is the single interface describing everything about a role.
 * All role-related behavior should be derived from this config.
 */

/** Structured model specification with optional fallbacks. */
export type ModelSpecObject = {
  primary: string;
  fallbacks?: string[];
};

/** Model specification accepted by the registry and selectors. */
export type ModelSpec = string | ModelSpecObject;

/** Determine whether a model spec is an object with primary/fallbacks. */
export function isModelSpecObject(spec: ModelSpec): spec is ModelSpecObject {
  return typeof spec === "object" && spec !== null && "primary" in spec;
}

/**
 * Normalize a model spec into a primary model plus fallbacks array.
 * Returns a shallow copy so callers can mutate the fallback list safely.
 */
export function normalizeModelSpec(spec: ModelSpec): { primary: string; fallbacks: string[] } {
  if (isModelSpecObject(spec)) {
    const fallbacks = Array.isArray(spec.fallbacks)
      ? spec.fallbacks.filter((f): f is string => typeof f === "string")
      : [];
    return { primary: spec.primary, fallbacks: [...fallbacks] };
  }
  return { primary: spec, fallbacks: [] };
}

/** Get the primary model ID for a model spec. */
export function getModelPrimary(spec: ModelSpec): string {
  return normalizeModelSpec(spec).primary;
}

/** Get the fallback model IDs for a model spec. */
export function getModelFallbacks(spec: ModelSpec): string[] {
  return normalizeModelSpec(spec).fallbacks;
}

/** Configuration for a single worker role. */
export type RoleConfig = {
  /** Unique role identifier (e.g., "developer", "tester", "architect"). */
  id: string;
  /** Human-readable display name. */
  displayName: string;
  /** Valid levels for this role. */
  levels: readonly string[];
  /** Default level when none specified. */
  defaultLevel: string;
  /** Default model per level. */
  models: Record<string, ModelSpec>;
  /** Emoji per level (used in announcements). */
  emoji: Record<string, string>;
  /** Fallback emoji when level-specific emoji not found. */
  fallbackEmoji: string;
  /** Valid completion results for this role. */
  completionResults: readonly string[];
  /** Regex pattern fragment for session key matching (e.g., "developer|tester|architect"). */
  sessionKeyPattern: string;
  /** Notification config per event type. */
  notifications: {
    onStart: boolean;
    onComplete: boolean;
  };
};

/** A role ID string (typed from registry keys). */
export type RoleId = string;
