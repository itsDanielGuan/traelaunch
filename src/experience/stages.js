export const STAGES = Object.freeze({
  PROLOGUE: "prologue",
  DECISION_APPROACH: "decision-approach",
  CONSEQUENCE_APPROACH: "consequence-approach",
  DECISION_KNEEL_RESPONSE: "decision-kneel-response",
  CONSEQUENCE_KNEEL_RESPONSE: "consequence-kneel-response",
  ENDING: "ending",
  PRODUCT: "product",
});

export const DECISION_KEYS = Object.freeze(["approach", "kneelResponse"]);

export function isDecisionStage(stage) {
  return stage === STAGES.DECISION_APPROACH || stage === STAGES.DECISION_KNEEL_RESPONSE;
}

export function isConsequenceStage(stage) {
  return stage === STAGES.CONSEQUENCE_APPROACH || stage === STAGES.CONSEQUENCE_KNEEL_RESPONSE;
}

export function decisionKeyForStage(stage) {
  switch (stage) {
    case STAGES.DECISION_APPROACH:
    case STAGES.CONSEQUENCE_APPROACH:
      return "approach";
    case STAGES.DECISION_KNEEL_RESPONSE:
    case STAGES.CONSEQUENCE_KNEEL_RESPONSE:
      return "kneelResponse";
    default:
      return null;
  }
}

export function decisionStageForKey(decisionKey) {
  switch (decisionKey) {
    case "approach":
      return STAGES.DECISION_APPROACH;
    case "kneelResponse":
      return STAGES.DECISION_KNEEL_RESPONSE;
    default:
      return null;
  }
}

export function consequenceStageForKey(decisionKey) {
  switch (decisionKey) {
    case "approach":
      return STAGES.CONSEQUENCE_APPROACH;
    case "kneelResponse":
      return STAGES.CONSEQUENCE_KNEEL_RESPONSE;
    default:
      return null;
  }
}

export function nextStageAfterVideo(stage, choices = {}) {
  switch (stage) {
    case STAGES.PROLOGUE:
      return STAGES.DECISION_APPROACH;
    case STAGES.CONSEQUENCE_APPROACH:
      return choices.approach === "kneel" ? STAGES.DECISION_KNEEL_RESPONSE : null;
    default:
      return null;
  }
}
