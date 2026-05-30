export { ExperienceProvider, useExperience } from "./context";
export { decisionData } from "./decisionData";
export { endingData } from "./endingData";
export { MEDIA_PATHS, PLACEHOLDER_VIDEO_SRC, resolveVideoSrc } from "./mediaPaths";
export { productData } from "./productData";
export { initialExperienceState } from "./initialState";
export { experienceActions, experienceReducer } from "./reducer";
export { applyScoreDelta, resolveEnding, resolveOpenGates } from "./scoring";
export { getCurrentDecision, getCurrentDecisionKey, getCurrentVideoSrc } from "./selectors";
export {
  DECISION_KEYS,
  STAGES,
  decisionKeyForStage,
  isConsequenceStage,
  isDecisionStage,
  nextStageAfterVideo,
} from "./stages";
