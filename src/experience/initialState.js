import { STAGES } from "./stages";

export const initialExperienceState = Object.freeze({
  currentStage: STAGES.PROLOGUE,
  choices: {
    approach: null,
    kneelResponse: null,
    fightStyle: null,
  },
  scores: {
    destroyer: 0,
    saint: 0,
    heretic: 0,
    apostle: 0,
  },
  ending: null,
  product: null,
});
