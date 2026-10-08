// ---------------------------------------------------------------------------
// Intro (loading screen) session state.
//
// Three places have to agree on this flag: the pre-paint inline script in
// layout.tsx, the Loader itself, and Hero (which waits for the loader before
// animating its headline). Centralising the literals here is what keeps them
// from drifting apart.
// ---------------------------------------------------------------------------

/** sessionStorage key — the durable fact: "the intro already ran this session". */
export const INTRO_KEY = "introPlayed";

/** Attribute stamped on <html> before first paint when INTRO_KEY is set.
 *
 *  This exists so the Loader component can render the SAME markup on the server
 *  and on the client's first render. Deciding visibility during render (by
 *  reading sessionStorage in a useState initialiser) makes the server emit the
 *  loader and the client emit nothing — a hydration mismatch, which React
 *  resolves by throwing away and re-rendering the subtree on exactly the visit
 *  that should have been the fastest. CSS keyed off this attribute hides the
 *  loader instead, before anything is painted. */
export const INTRO_ATTR = "data-intro";
export const INTRO_ATTR_VALUE = "played";

/** Client-only. Safe to call from effects and event handlers, not during render. */
export function introAlreadyPlayed(): boolean {
  try {
    return sessionStorage.getItem(INTRO_KEY) === "1";
  } catch {
    // Private mode / storage disabled — the intro simply replays next load.
    return false;
  }
}

export function markIntroPlayed(): void {
  try {
    sessionStorage.setItem(INTRO_KEY, "1");
  } catch {
    /* see above — harmless */
  }
}
