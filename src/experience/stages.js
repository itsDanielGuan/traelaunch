export const STAGES = Object.freeze({
  PROLOGUE: "prologue",
  DECISION_ROUTE: "decision-route",
  CONSEQUENCE_ROUTE: "consequence-route",
  DECISION_BLADE: "decision-blade",
  CONSEQUENCE_BLADE: "consequence-blade",
  DECISION_SACRIFICE: "decision-sacrifice",
  CONSEQUENCE_SACRIFICE: "consequence-sacrifice",
  DECISION_COMMAND: "decision-command",
  CONSEQUENCE_COMMAND: "consequence-command",
  ENDING: "ending",
  PRODUCT: "product",
});

export const DECISION_KEYS = Object.freeze(["route", "blade", "sacrifice", "command"]);

export function isDecisionStage(stage) {
  return (
    stage === STAGES.DECISION_ROUTE ||
    stage === STAGES.DECISION_BLADE ||
    stage === STAGES.DECISION_SACRIFICE ||
    stage === STAGES.DECISION_COMMAND
  );
}

export function isConsequenceStage(stage) {
  return (
    stage === STAGES.CONSEQUENCE_ROUTE ||
    stage === STAGES.CONSEQUENCE_BLADE ||
    stage === STAGES.CONSEQUENCE_SACRIFICE ||
    stage === STAGES.CONSEQUENCE_COMMAND
  );
}

export function decisionKeyForStage(stage) {
  switch (stage) {
    case STAGES.DECISION_ROUTE:
    case STAGES.CONSEQUENCE_ROUTE:
      return "route";
    case STAGES.DECISION_BLADE:
    case STAGES.CONSEQUENCE_BLADE:
      return "blade";
    case STAGES.DECISION_SACRIFICE:
    case STAGES.CONSEQUENCE_SACRIFICE:
      return "sacrifice";
    case STAGES.DECISION_COMMAND:
    case STAGES.CONSEQUENCE_COMMAND:
      return "command";
    default:
      return null;
  }
}

export function decisionStageForKey(decisionKey) {
  switch (decisionKey) {
    case "route":
      return STAGES.DECISION_ROUTE;
    case "blade":
      return STAGES.DECISION_BLADE;
    case "sacrifice":
      return STAGES.DECISION_SACRIFICE;
    case "command":
      return STAGES.DECISION_COMMAND;
    default:
      return null;
  }
}

export function consequenceStageForKey(decisionKey) {
  switch (decisionKey) {
    case "route":
      return STAGES.CONSEQUENCE_ROUTE;
    case "blade":
      return STAGES.CONSEQUENCE_BLADE;
    case "sacrifice":
      return STAGES.CONSEQUENCE_SACRIFICE;
    case "command":
      return STAGES.CONSEQUENCE_COMMAND;
    default:
      return null;
  }
}

export function nextStageAfterVideo(stage) {
  switch (stage) {
    case STAGES.PROLOGUE:
      return STAGES.DECISION_ROUTE;
    case STAGES.CONSEQUENCE_ROUTE:
      return STAGES.DECISION_BLADE;
    case STAGES.CONSEQUENCE_BLADE:
      return STAGES.DECISION_SACRIFICE;
    case STAGES.CONSEQUENCE_SACRIFICE:
      return STAGES.DECISION_COMMAND;
    default:
      return null;
  }
}
