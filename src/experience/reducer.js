import { decisionData } from "./decisionData";
import { endingData } from "./endingData";
import { initialExperienceState } from "./initialState";
import { productData } from "./productData";
import { applyScoreDelta } from "./scoring";
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
      return decisionKey === "approach";
    case STAGES.CONSEQUENCE_APPROACH:
      return decisionKey === "kneelResponse" || decisionKey === "fightStyle";
    default:
      return false;
  }
}

function resolveEndingFromChoices(choices) {
  if (choices.approach === "fight") {
    if (choices.fightStyle === "aggressive") {
      return "fight-aggressive";
    }

    if (choices.fightStyle === "defensive") {
      return "fight-defensive";
    }
  }

  if (choices.approach === "kneel" && choices.kneelResponse === "give-up") {
    return "kneel-give-up";
  }

  if (choices.approach === "kneel" && choices.kneelResponse === "sneak-attack") {
    return "kneel-sneak-attack";
  }

  return null;
}

function reduceVideoEnded(state) {
  const stage = state.currentStage;

  if (stage === STAGES.CONSEQUENCE_FIGHT_STYLE) {
    const endingKey = resolveEndingFromChoices(state.choices);
    const ending = endingKey ? endingData[endingKey] : null;
    const productKey = ending?.product ?? null;
    const product = productKey && productData[productKey] ? productKey : null;

    return {
      ...state,
      currentStage: STAGES.ENDING,
      ending: endingKey,
      product,
    };
  }

  if (stage === STAGES.CONSEQUENCE_KNEEL_RESPONSE) {
    const endingKey = resolveEndingFromChoices(state.choices);
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

  const nextStage = nextStageAfterVideo(stage, state.choices);
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
