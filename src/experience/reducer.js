import { decisionData } from "./decisionData";
import { endingData } from "./endingData";
import { initialExperienceState } from "./initialState";
import { productData } from "./productData";
import { applyScoreDelta, resolveEnding, resolveOpenGates } from "./scoring";
import {
  consequenceStageForKey,
  decisionKeyForStage,
  isDecisionStage,
  nextStageAfterVideo,
  STAGES,
} from "./stages";

export const EXPERIENCE_ACTIONS = Object.freeze({
  RESET: "experience/reset",
  SELECT_CHOICE: "experience/selectChoice",
  VIDEO_ENDED: "experience/videoEnded",
  REVEAL_PRODUCT: "experience/revealProduct",
});

export function experienceReducer(state, action) {
  switch (action.type) {
    case EXPERIENCE_ACTIONS.RESET:
      return initialExperienceState;
    case EXPERIENCE_ACTIONS.SELECT_CHOICE:
      return reduceSelectChoice(state, action.payload);
    case EXPERIENCE_ACTIONS.VIDEO_ENDED:
      return reduceVideoEnded(state);
    case EXPERIENCE_ACTIONS.REVEAL_PRODUCT:
      if (state.currentStage !== STAGES.ENDING) return state;
      return { ...state, currentStage: STAGES.PRODUCT };
    default:
      return state;
  }
}

function reduceSelectChoice(state, payload) {
  if (!payload) return state;

  const decisionKey = payload.decisionKey ?? decisionKeyForStage(state.currentStage);
  if (!decisionKey) return state;
  if (!isChoiceSelectionAllowed(state.currentStage, decisionKey)) return state;

  const decision = decisionData[decisionKey];
  if (!decision) return state;

  const optionId = payload.optionId;
  const option = decision.options.find((o) => o.id === optionId);
  if (!option) return state;

  let nextScores = applyScoreDelta(state.scores, option.score);
  if (decisionKey === "command" && optionId === "open-gates") {
    nextScores = resolveOpenGates(nextScores);
  }

  const nextChoices = { ...state.choices, [decisionKey]: optionId };
  const nextStage = consequenceStageForKey(decisionKey);

  return {
    ...state,
    currentStage: nextStage ?? state.currentStage,
    choices: nextChoices,
    scores: nextScores,
  };
}

function isChoiceSelectionAllowed(stage, decisionKey) {
  if (isDecisionStage(stage)) return decisionKeyForStage(stage) === decisionKey;

  switch (stage) {
    case STAGES.PROLOGUE:
      return decisionKey === "route";
    case STAGES.CONSEQUENCE_ROUTE:
      return decisionKey === "blade";
    case STAGES.CONSEQUENCE_BLADE:
      return decisionKey === "sacrifice";
    case STAGES.CONSEQUENCE_SACRIFICE:
      return decisionKey === "command";
    default:
      return false;
  }
}

function reduceVideoEnded(state) {
  const stage = state.currentStage;

  if (stage === STAGES.CONSEQUENCE_COMMAND) {
    const endingKey = resolveEnding(state.scores);
    const ending = endingData[endingKey];
    const productKey = ending?.product ?? null;
    const product = productKey && productData[productKey] ? productKey : null;

    return {
      ...state,
      currentStage: STAGES.ENDING,
      ending: endingKey,
      product,
    };
  }

  const nextStage = nextStageAfterVideo(stage);
  if (!nextStage) return state;

  return { ...state, currentStage: nextStage };
}

export const experienceActions = Object.freeze({
  reset() {
    return { type: EXPERIENCE_ACTIONS.RESET };
  },
  selectChoice(decisionKey, optionId) {
    return { type: EXPERIENCE_ACTIONS.SELECT_CHOICE, payload: { decisionKey, optionId } };
  },
  videoEnded() {
    return { type: EXPERIENCE_ACTIONS.VIDEO_ENDED };
  },
  revealProduct() {
    return { type: EXPERIENCE_ACTIONS.REVEAL_PRODUCT };
  },
});
