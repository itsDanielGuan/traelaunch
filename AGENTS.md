<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Saint Circuit: Agent Deliverables Split

Source of truth: `DELIVERABLES.md`

## Deliverables (MVP)

- Landing with looping video + CTA into experience
- Prologue (60s) → 4 decisions (3 options each) → consequence clips (30s) → ending (30s) → product reveal (10–15s)
- Ending resolution logic and scoring (`destroyer/saint/heretic/apostle`), including the “Open the Gates” conditional rule
- Codex page and Behind-the-scenes page
- Final write-up content describing PixVerse + TRAE usage

## PixVerse-Only Requirement (Applies To All Video Deliverables)

- Use PixVerse models only for any generated/modified/extended/transitioned video assets used in the demo and submission.
- Disallowed: any non-PixVerse model IDs (e.g., `sora-*`, `veo-*`, `seedance-*`, `kling-*`, `grok-imagine`, `happyhorse-*`).
- Allowed (default allowlist; adjust if the team agrees): `v6`, `pixverse-c1`, `v5.6`, `v5.5`, `v5`.
- Every exported final clip should have a small metadata note captured somewhere in the repo (prompt + model + seed/settings) so we can prove PixVerse-only usage in the write-up.

## Agent Ownership Map

To minimize conflicts, each agent owns a file area and avoids editing outside it unless coordinated.

### Agent A — Experience State + Logic

- Owns: scoring, stage machine, ending/product resolution, replay/reset, optional persistence
- Works in: `src/experience/**` and `src/app/experience/**`
- Avoids: shared video component implementation and landing page UI

### Agent B — Video Playback System

- Owns: reusable video player (skip gating, loading/preload, events), consistent controls
- Works in: `src/components/video/**`
- Avoids: decision logic and route orchestration

### Agent C — Core Screens + Styling

- Owns: landing experience, decision screen layout, ending/product reveal UI polish, navigation
- Works in: `src/app/**` (except the areas owned by other agents) and `src/components/ui/**`
- Avoids: reducer/scoring logic internals

### Agent D — Content Pages (Codex + BTS)

- Owns: Codex content structure, Behind-the-scenes PixVerse/TRAE workflow page, optional galleries
- Works in: `src/app/codex/**`, `src/app/behind-the-scenes/**`, `src/content/**`
- Avoids: core experience reducer and video player internals
