const SCORE_KEYS = ["destroyer", "saint", "heretic", "apostle"];

export function applyScoreDelta(scores, delta) {
  if (!delta) return scores;
  let changed = false;

  const next = { ...scores };
  for (const key of SCORE_KEYS) {
    const add = delta[key];
    if (!add) continue;
    changed = true;
    next[key] = (next[key] ?? 0) + add;
  }

  return changed ? next : scores;
}

export function resolveOpenGates(scores) {
  const mercyScore = (scores.apostle ?? 0) + (scores.saint ?? 0);
  const corruptionScore = (scores.heretic ?? 0) + (scores.destroyer ?? 0);

  if (mercyScore >= corruptionScore) {
    return applyScoreDelta(scores, { apostle: 2 });
  }
  return applyScoreDelta(scores, { heretic: 2 });
}

export function resolveEnding(scores) {
  const ordered = ["destroyer", "saint", "heretic", "apostle"];
  let bestKey = ordered[0];
  let bestScore = scores[bestKey] ?? 0;

  for (const key of ordered.slice(1)) {
    const score = scores[key] ?? 0;
    if (score > bestScore) {
      bestKey = key;
      bestScore = score;
    }
  }

  return bestKey;
}

