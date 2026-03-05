/**
 * roles/types.ts — Type definitions for the role registry.
 *
 * RoleConfig is the single interface describing everything about a role.
 * All role-related behavior should be derived from this config.
 */

/** Structured model specification with optional fallbacks (input form). */
export type ModelSpecObject = {
  primary: string;
  fallbacks?: string[];
};

/** Normalized model specification used throughout the runtime. */
export type ModelSpec = {
  primary: string;
  fallbacks: string[];
};

/** Accepts string or object input when normalizing. */
export type ModelSpecInput = string | ModelSpecObject | ModelSpec;

/** Determine whether a value is a structured model spec input. */
export function isModelSpecObject(spec: unknown): spec is ModelSpecObject {
  return typeof spec === "object" && spec !== null && "primary" in spec;
}

/**
 * Normalize a model spec into `{ primary, fallbacks[] }`.
 * Returns a shallow copy so callers can mutate the fallback list safely.
 */
export function normalizeModelSpec(spec: ModelSpecInput): ModelSpec {
  if (typeof spec === "string") {
    return { primary: spec, fallbacks: [] };
  }

  const fallbacksSource = Array.isArray((spec as ModelSpecObject).fallbacks)
    ? (spec as ModelSpecObject).fallbacks!
    : Array.isArray((spec as ModelSpec).fallbacks)
      ? (spec as ModelSpec).fallbacks
      : [];

  const fallbacks = fallbacksSource.filter((f): f is string => typeof f === "string");
  return { primary: spec.primary, fallbacks: [...new Set(fallbacks)] };
}

/** Get the primary model ID for a model spec. */
export function getModelPrimary(spec: ModelSpecInput): string {
  return normalizeModelSpec(spec).primary;
}

/** Get the fallback model IDs for a model spec. */
export function getModelFallbacks(spec: ModelSpecInput): string[] {
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
  models: Record<string, ModelSpecInput>;
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
