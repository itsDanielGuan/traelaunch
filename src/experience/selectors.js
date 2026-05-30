import { decisionData } from "./decisionData";
import { endingData } from "./endingData";
import { MEDIA_PATHS, resolveVideoSrc } from "./mediaPaths";
import { productData } from "./productData";
import { decisionKeyForStage, isConsequenceStage, isDecisionStage, STAGES } from "./stages";

export const PROLOGUE_VIDEO_SRC = MEDIA_PATHS.prologue;

export function getCurrentDecisionKey(state) {
  return decisionKeyForStage(state.currentStage);
}

export function getCurrentDecision(state) {
  const key = getCurrentDecisionKey(state);
  if (!key) return null;
  return decisionData[key] ?? null;
}

export function getSelectedOption(state, decisionKey) {
  const id = state.choices?.[decisionKey];
  if (!id) return null;
  const decision = decisionData[decisionKey];
  return decision?.options?.find((o) => o.id === id) ?? null;
}

export function getCurrentVideoSrc(state) {
  const stage = state.currentStage;

  if (stage === STAGES.PROLOGUE) return resolveVideoSrc(PROLOGUE_VIDEO_SRC);

  if (isDecisionStage(stage)) return null;

  if (isConsequenceStage(stage)) {
    const decisionKey = decisionKeyForStage(stage);
    const option = getSelectedOption(state, decisionKey);
    return option?.video ? resolveVideoSrc(option.video) : null;
  }

  if (stage === STAGES.ENDING) {
    const data = endingData[state.ending];
    return data?.video ? resolveVideoSrc(data.video) : null;
  }

  if (stage === STAGES.PRODUCT) {
    const data = productData[state.product];
    return data?.video ? resolveVideoSrc(data.video) : null;
  }

  return null;
}
