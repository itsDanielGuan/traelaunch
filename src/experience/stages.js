export const STAGES = Object.freeze({
  PROLOGUE: "prologue",
  DECISION_APPROACH: "decision-approach",
  CONSEQUENCE_APPROACH: "consequence-approach",
  DECISION_KNEEL_RESPONSE: "decision-kneel-response",
  CONSEQUENCE_KNEEL_RESPONSE: "consequence-kneel-response",
  DECISION_FIGHT_STYLE: "decision-fight-style",
  CONSEQUENCE_FIGHT_STYLE: "consequence-fight-style",
  ENDING: "ending",
  PRODUCT: "product",
});

export const DECISION_KEYS = Object.freeze(["approach", "kneelResponse", "fightStyle"]);

export function isDecisionStage(stage) {
  return (
    stage === STAGES.DECISION_APPROACH ||
    stage === STAGES.DECISION_KNEEL_RESPONSE ||
    stage === STAGES.DECISION_FIGHT_STYLE
  );
}

export function isConsequenceStage(stage) {
  return (
    stage === STAGES.CONSEQUENCE_APPROACH ||
    stage === STAGES.CONSEQUENCE_KNEEL_RESPONSE ||
    stage === STAGES.CONSEQUENCE_FIGHT_STYLE
  );
}

export function decisionKeyForStage(stage) {
  switch (stage) {
    case STAGES.DECISION_APPROACH:
    case STAGES.CONSEQUENCE_APPROACH:
      return "approach";
    case STAGES.DECISION_KNEEL_RESPONSE:
    case STAGES.CONSEQUENCE_KNEEL_RESPONSE:
      return "kneelResponse";
    case STAGES.DECISION_FIGHT_STYLE:
    case STAGES.CONSEQUENCE_FIGHT_STYLE:
      return "fightStyle";
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
    case "fightStyle":
      return STAGES.DECISION_FIGHT_STYLE;
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
    case "fightStyle":
      return STAGES.CONSEQUENCE_FIGHT_STYLE;
    default:
      return null;
  }
}

export function nextStageAfterVideo(stage, choices = {}) {
  switch (stage) {
    case STAGES.PROLOGUE:
      return STAGES.DECISION_APPROACH;
    case STAGES.CONSEQUENCE_APPROACH:
      if (choices.approach === "kneel") return STAGES.DECISION_KNEEL_RESPONSE;
      if (choices.approach === "fight") return STAGES.DECISION_FIGHT_STYLE;
      return null;
    default:
      return null;
  }
}
